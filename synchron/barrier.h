// barrier.h
//	Data structures of synchronization mechanism barrier
//
// source
//	http://athena.univ-lille1.fr:8888/ab2/coll.45.4/MTP/@Ab2TocView/

#ifndef barrier_h
#define barrier_h
#define _REENTRANT

#include <thread.h>
#include <errno.h>

// barrier type
typedef struct {
    int maxcnt;			// maximum number of runners
    struct _sb {
        cond_t  wait_cv;   	// condition variable
        mutex_t wait_lk;	// mutex, lock 
        int     runners;	// number of running threads
    } sb[2];			// two sub-barriers
    struct _sb *sbp;		// ptr to current sub-barrier
} barrier_t;

// barrierfunctions
int barrier_init(barrier_t *bp, int count, int type, void *arg);
				// initialize barrier
int barrier_wait(register barrier_t *bp) ;
				// wait on barrier
int barrier_destroy(barrier_t *bp);
				// destroy barrier

#endif
