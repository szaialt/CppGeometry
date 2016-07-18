#include "barrier.h"

Barrier::Barrier(unsigned int n) {
    expectedN = n;
    currentN = expectedN;
}

void Barrier::Wait(void) {
    counterMutex.lock();

    // If we're the first thread, we want an extra lock at our disposal

    if (currentN == expectedN) {
        waitMutex.lock();
    }

    // Decrease thread counter

    --currentN;

    if (currentN == 0) {
        currentN = expectedN;
        waitMutex.unlock();

        currentN = expectedN;
        counterMutex.unlock();
    } else {
        counterMutex.unlock();

        waitMutex.lock();
        waitMutex.unlock();
    }
}