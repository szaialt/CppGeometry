#include <thread>
#include <iostream>
#include <sstream>
#include <future>
#include <queue>
#include <condition_variable>
#include <mutex>

// Convenience type definition
using job = std::packaged_task<void()>;

// Some data associated to each thread.
struct thread_data
{
    int id; // Could use thread::id, but this is filled before the thread is started
    std::thread t; // The thread object
    std::queue<job> jobs; // The job queue
    std::condition_variable cv; // The condition variable to wait for threads
    std::mutex m; // Mutex used for avoiding data races
    bool stop = false; // When set, this flag tells the thread that it should exit
};

// The thread function executed by each thread
void thread_func(thread_data* pData)
{
    std::unique_lock<std::mutex> l(pData->m, std::defer_lock);
    while (true)
    {
        l.lock();

        // Wait until the queue won't be empty or stop is signaled
        pData->cv.wait(l, [pData] () {
            return (pData->stop || !pData->jobs.empty()); 
            });

        // Stop was signaled, let's exit the thread
        if (pData->stop) { return; }

        // Pop one task from the queue...
        job j = std::move(pData->jobs.front());
        pData->jobs.pop();

        l.unlock();

        // Execute the task!
        j();
    }
}

// Function that creates a simple task
job create_task(int id, int jobNumber)
{
    job j([id, jobNumber] ()
    {
        std::stringstream s;
        s << "Hello " << id << "." << jobNumber << std::endl;
        std::cout << s.str();
    });

    return j;
}

int main()
{
    const int numThreads = 4;
    const int numJobsPerThread = 10;
    std::vector<std::future<void>> futures;

    // Create all the threads (will be waiting for jobs)
    thread_data threads[numThreads];
    int tdi = 0;
    for (auto& td : threads)
    {
        td.id = tdi++;
        td.t = std::thread(thread_func, &td);
    }

    //=================================================
    // Start assigning jobs to each thread...

    for (auto& td : threads)
    {
        for (int i = 0; i < numJobsPerThread; i++)
        {
            job j = create_task(td.id, i);
            futures.push_back(j.get_future());

            std::unique_lock<std::mutex> l(td.m);
            td.jobs.push(std::move(j));
        }

        // Notify the thread that there is work do to...
        td.cv.notify_one();
    }

    // Wait for all the tasks to be completed...
    for (auto& f : futures) { f.wait(); }
    futures.clear();


    //=================================================
    // Here the main thread does something...

    std::cin.get();

    // ...done!
    //=================================================


    //=================================================
    // Posts some new tasks...

    for (auto& td : threads)
    {
        for (int i = 0; i < numJobsPerThread; i++)
        {
            job j = create_task(td.id, i);
            futures.push_back(j.get_future());

            std::unique_lock<std::mutex> l(td.m);
            td.jobs.push(std::move(j));
        }

        // Notify the thread that there is work do to...
        td.cv.notify_one();
    }

    // Wait for all the tasks to be completed...
    for (auto& f : futures) { f.wait(); }
    futures.clear();

    // Send stop signal to all threads and join them...
    for (auto& td : threads)
    {
        std::unique_lock<std::mutex> l(td.m);
        td.stop = true;
        td.cv.notify_one();
    }

    // Join all the threads
    for (auto& td : threads) { td.t.join(); }
}