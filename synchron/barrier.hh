// barrier.h
//	Class members of synchronization mechanism barrier.
//
// developed from the following C source code:
//	http://athena.univ-lille1.fr:8888/ab2/coll.45.4/MTP/@Ab2TocView/
//
// Y. Wu, McMaster University, Sept. 2000

#ifndef barrier_h
#define barrier_h
#define _REENTRANT

#include <thread.h>
#include <errno.h>

// The following structure defines a subbarrier in a barrier.
// It consists of a lock and a condition variable for waiters at
// this subbarrier and the number of running threads associated
// with this subbarrier.

typedef  struct 
{
    cond_t  wait_cv;   // condition variable for waiters at barrier 
    mutex_t wait_lk;   // mutex for waiters at barrier 
    int     runners;   // number of running threads 
} _sb;

// The following class defines a barrier, a synchronization mechanism.
// A thread called Wait is blocked untill all threads associated with
// this barrier have called Wait.

class Barrier
{
    public:
        Barrier(int count, int type, void *arg);   // initialize barrier
        ~Barrier();                                // destroy barrier 
        int Wait();                                // wait on barrier
    private:
        int maxcnt;                         // maximun number of runners
        _sb sb[2];                          // two sub-barriers
        _sb *CurrentSb;                     // ptr to current sub-barrier
};

#endif
