#include <mutex>              // std::mutex, std::unique_lock

class Barrier {
public:
    Barrier(unsigned int n);
    void Wait(void);
private:
    std::mutex counterMutex;
    std::mutex waitMutex;

    unsigned int expectedN;
    unsigned int currentN;
};