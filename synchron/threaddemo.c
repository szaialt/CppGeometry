// threaddemo.c                                                         
//
// This simple program illustrates multithreading including the creation 
// and termination of threads and the use of barrier synchronization     
// mechanis.
// 
// S. Qiao and Y. Wu, McMaster University, August 2000

#include <thread.h>
#include <stdio.h>
#include <stdlib.h>
#include "barrier.h"

// constants
#define DIM 1000
#define ORDER 11 
#define THREADNUM 3

// functions in this file
void *GenEntries(int *);
int  SumCol(int);
void MatrixInit(int);
int IsCorrect(int);

// globals, shared variables
barrier_t ba;
int arg[THREADNUM];
thread_t tid[DIM];
int Matrix[DIM][ORDER];

//-------------------------------------------------------------------------
// main
//	Create threads. Threads run a function and are synchronized each
//	other. The main thread waits until all threads finish.
//-------------------------------------------------------------------------	
int
main()
{
    int row;
    MatrixInit(1);		// initialize first column of Matrix to 1
   
    barrier_init(&ba,THREADNUM,USYNC_THREAD, NULL);
				// initialize barrier

    for (row = 0; row < THREADNUM; row++) {
        arg[row] = row;		// thread id
        printf("Creating thread %d......\n", row);
        thr_create(NULL,0, (void *)GenEntries, &arg[row], 0 , &tid[row]);
    }

    while (thr_join(NULL,NULL,NULL) == 0);
				// main waits for threads to finish

   // check results
    if (IsCorrect(1)==1)
        printf("The result is correct!\n");
    else
        printf("The result is incorrect!\n");

    return(0);
}

//-------------------------------------------------------------------------
// GenEntries
//	For each column of Matrix, this function computes the average of
//	its previous column then writes the result to the rows in this
//	column such that
//                (row number) mod (THREADNUM) = (*tidptr)
// 	i.e., threads write to the rows in round-robin fashion.
//
//      "tidptr" is a pointer to an integer between 0 and THREADNUM-1
//-------------------------------------------------------------------------
void *
GenEntries(int *tidptr)
{
    int Row, row, col ;
    Row = *tidptr;

    for (col = 1; col < ORDER; col++) {
        for (row = Row; row < DIM; row += THREADNUM)
            Matrix[row][col] = SumCol(col - 1)/DIM;

        barrier_wait(&ba);	// wait until all threads finish this col.
    }
    thr_exit(0);
}

//-------------------------------------------------------------------------
// SumCol
//	Return the sum of column of Matrix given the column number.
//
//	"colNum" is the column number
//-------------------------------------------------------------------------
int
SumCol(int colNum)
{
    int sum, row;
    sum = 0;

    for (row = 0; row < DIM; row++)
        sum = sum + Matrix[row][colNum];

    return sum;
}

//-------------------------------------------------------------------------
// MatrixInit
//	Initialize the first column of Matrix with the given value.
//
//	"value" is the value used to initialize Matrix
//-------------------------------------------------------------------------
void
MatrixInit(int value)
{
    int row;
    for ( row = 0; row < DIM; row++)
        Matrix[row][0] = value;
}

//-------------------------------------------------------------------------
// IsCorrect
//	Return TRUE if the resulting Matrix is correct, FALSE otherwise.
//
//	"value" is the value used to initialize Matrix
//-------------------------------------------------------------------------
int
IsCorrect(int value)
{
    int row, col;

    for (row = 0; row < DIM; row++)
        for (col = 0; col < ORDER; col++)
            if (Matrix[row][col] != value)
                return 0;

    return 1;
}

