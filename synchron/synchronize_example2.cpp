 using namespace std;

 // semaphore class based on C++11 features
 class semaphore {
     private:
         mutex mMutex;
         condition_variable v;
         int mV;
     public:
         semaphore(int v): mV(v){}
         void signal(int count=1){
             unique_lock lock(mMutex);
             mV+=count;
             if (mV > 0) mCond.notify_all();
         }
         void wait(int count = 1){
             unique_lock lock(mMutex);
             mV-= count;
             while (mV < 0)
                 mCond.wait(lock);
         }
 };

template <typename Task>
class TaskThread {
     thread mThread;
     Task *mTask;
     semaphore *mSemStarting, *mSemFinished;
     volatile bool mRunning;
    public:
    TaskThread(Task *task, semaphore *start, semaphore *finish): 
         mTask(task), mRunning(true), 
         mSemStart(start), mSemFinished(finish),
        mThread(&TaskThread<Task>::psrun){}
    ~TaskThread(){ mThread.join(); }

    void run(){
        do {
             (*mTask)();
             mSemFinished->signal();
             mSemStart->wait();
        } while (mRunning);
    }

   void finish() { // end the thread after the current loop
         mRunning = false;
   }
private:
    static void psrun(TaskThread<Task> *self){ self->run();}
 };

 classcMyTask {
     public:
     MyTask(){}
    void operator()(){
        // some code here
     }
 };

int main(){
    MyTask task1;
    MyTask task2;
    semaphore start(2), finished(0);
    TaskThread<MyTask> t1(&task1, &start, &finished);
    TaskThread<MyTask> t2(&task2, &start, &finished);
    for (int i = 0; i < 10; i++){
         finished.wait(2);
         start.signal(2);
    }
    t1.finish();
    t2.finish();
}