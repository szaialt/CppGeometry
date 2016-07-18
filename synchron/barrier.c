// barrier.c
//	Implementations of barrier functions.
//
// source
//	http://athena.univ-lille1.fr:8888/ab2/coll.45.4/MTP/@Ab2TocView/

#include "barrier.h"

//--------------------------------------------------------------------------
// barrier_init
//	Initialize a barrier for given number of threads.
//
//	"bp" is a pointer to a place for the barrier
//	"count" is the number of threads involved
//	"type" is one of three types: 
//             USYN_THREAD  :  synchronize threads in the same process. 
//             USYN_PROCESS : synchronize different processes. 
//             USYN_PROCESS_ROBUST : synchronize threads in different processes. 
//	"arg" is reserved for future use.
//--------------------------------------------------------------------------
int
barrier_init(barrier_t *bp, int count, int type, void *arg)
{
    int n;
    int i;

    if (count < 1)
        return(EINVAL);

    bp->maxcnt = count;
    bp->sbp = &bp->sb[0];

    for (i = 0; i < 2; ++i) {
#if defined(__cplusplus)
        struct barrier_t::_sb *sbp = &(bp->sb[i]);
#else
        struct _sb *sbp = &(bp->sb[i]);
#endif
        sbp->runners = count;

        if (n = mutex_init(&sbp->wait_lk, type, arg))
            return(n);		// construct a lock

        if (n = cond_init(&sbp->wait_cv, type, arg))
            return(n);		// construct a condition variable
    }
    return(0);
}

//---------------------------------------------------------------------------
// barrier_wait
//	Wait untill all threads reach this barrier.
//
//	"bp" is the pointer to the barrier
//---------------------------------------------------------------------------
int
barrier_wait(register barrier_t *bp) 
{
#if defined(__cplusplus)
    register struct barrier_t::_sb *sbp = bp->sbp;
#else
    register struct _sb *sbp = bp->sbp;
#endif
    mutex_lock(&sbp->wait_lk);		// acquire lock

    if (sbp->runners == 1) {   		// last thread to reach barrier
        if (bp->maxcnt != 1) {
            // reset runner count and switch sub-barriers
            sbp->runners = bp->maxcnt;
            bp->sbp = (bp->sbp == &bp->sb[0])? &bp->sb[1] : &bp->sb[0];

            // wake up the waiters
            cond_broadcast(&sbp->wait_cv);
        }
    } else {
        sbp->runners--;         	// one less runner

        // wait until the runner count is reset
        while (sbp->runners != bp->maxcnt)
            cond_wait( &sbp->wait_cv, &sbp->wait_lk);
    }

    mutex_unlock(&sbp->wait_lk);	// release lock

    return(0);
}

//---------------------------------------------------------------------------
// barrier_destroy
//  	Clean up.
//
//	"bp" is the pointer to the barrier
//---------------------------------------------------------------------------
int
barrier_destroy(barrier_t *bp) 
{
    int n;
    int i;

    for (i = 0; i < 2; ++ i) {
        if (n = cond_destroy(&bp->sb[i].wait_cv))
            return( n );		// delete condition variable

        if (n = mutex_destroy(&bp->sb[i].wait_lk))
            return(n);			// delete lock
    }
    return(0);
}

