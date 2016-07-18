#include <mutex>              // std::mutex, std::unique_lock
#include <thread>

class Barrier {
private:
    std::mutex _mutex;
    std::condition_variable _cv;
    std::size_t _count;
public:
    explicit Barrier(std::size_t count) : _count{count} { }
    void Wait();
};