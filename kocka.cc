/*
 * GL01Hello.cpp: Test OpenGL C/C++ Setup
 */
//#include <windows.h>  // For MS Windows
#define _USE_MATH_DEFINES
#include <math.h>
#include <GL/glut.h>  // GLUT, includes glu.h and gl.h
#include <time.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <vector>
#include <GL/glut.h>  // GLUT, includes glu.h and gl.h

using namespace std;

    double angle;
    
int approximately(int x, int y, int d) {
  if (((x-y) < d) || ((y-x) < d)) return 0;
  else return 1;
}  
 
int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

double random_double(){ return (double)rand() / RAND_MAX; }  
 
void drawCube(){
    glBegin(GL_QUADS);

     //#{"piros" oldal}

     glColor3f(1,0,0);

     glVertex3f(-0.5,0.5,-0.5);

     glColor3f(0.75,0,0);

     glVertex3f(0.5,0.5,-0.5);

     glColor3f(0.5,0,0);

     glVertex3f(0.5,-0.5,-0.5);

     glColor3f(0.25,0,0);

     glVertex3f(-0.5,-0.5,-0.5);

     //#{"zöld" oldal}

     glColor3f(0,1,0);

     glVertex3f(-0.5,0.5,0.5);

     glColor3f(0,0.75,0);

     glVertex3f(0.5,0.5,0.5);

     glColor3f(0,0.5,0);

     glVertex3f(0.5,-0.5,0.5);

     glColor3f(0,0.25,0);

     glVertex3f(-0.5,-0.5,0.5);

    // #{"kék" oldal}

     glColor3f(0,0,1);

     glVertex3f(-0.5,0.5,0.5);

     glColor3f(0,0,0.75);

     glVertex3f(-0.5,0.5,-0.5);

     glColor3f(0,0,0.5);

     glVertex3f(-0.5,-0.5,-0.5);

     glColor3f(0,0,0.25);

     glVertex3f(-0.5,-0.5,0.5);

     //# {"lila" oldal}

     glColor3f(1,0,1);

     glVertex3f(0.5,0.5,0.5);

     glColor3f(0.75,0,0.75);

     glVertex3f(0.5,0.5,-0.5);

     glColor3f(0.5,0,0.5);

     glVertex3f(0.5,-0.5,-0.5);

     glColor3f(0.25,0,0.25);

     glVertex3f(0.5,-0.5,0.5);

     //#{"sárga" oldal}

     glColor3f(1,1,0);

     glVertex3f(-0.5,0.5,0.5);

     glColor3f(0.75,0.75,0);

     glVertex3f(0.5,0.5,0.5);

     glColor3f(0.5,0.5,0);

     glVertex3f(0.5,0.5,-0.5);

     glColor3f(0.25,0.25,0);

     glVertex3f(-0.5,0.5,-0.5);

     //#{"cián" oldal}

     glColor3f(0,1,1);

     glVertex3f(-0.5,-0.5,0.5);

     glColor3f(0,0.75,0.75);

     glVertex3f(0.5,-0.5,0.5);

     glColor3f(0,0.5,0.5);

     glVertex3f(0.5,-0.5,-0.5);

     glColor3f(0,0.25,0.25);

     glVertex3f(-0.5,-0.5,-0.5);

     glEnd; 
     
}
/* Handler for window-repaint event. Call back when the window first appears and
   whenever the window needs to be re-painted. */
void display() {

   //GLint m_viewport[4];
   //glGetIntegerv( GL_VIEWPORT, m_viewport );

   glMatrixMode(GL_MODELVIEW);      // To operate on Model-View matrix
   glLoadIdentity();                // Reset the model-view matrix
   
    // Clear the screen and depth buffer
    //glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glPushMatrix;
    glTranslatef(0.0, -0.2, -6.0);
    glRotatef(angle,1.0,1.0,1.0);
    glScaled(0.75, 0.75, 0.75);
    drawCube();
     angle -= 0.15;
    glPopMatrix;
    // Swap buffers for display
     /* eddig elvegzett rajzolasok a kepernyore */
     glFlush();  // Render now
     glutSwapBuffers();

     sleep( 1 ); 
    } 

 
void keyPressed(unsigned char key, int x, int y){
  exit(0);
} 
 
int init(int argc, char** argv){
   glutInit(&argc, argv);                 // Initialize GLUT
   glutInitDisplayMode(GLUT_DOUBLE|GLUT_RGB);
   glutCreateWindow("OpenGL Setup Test"); // Create a window with the given title
   glutFullScreen();  /* Go to full screen */ 
   angle = 0.0;
   glutKeyboardFunc(keyPressed);
  
   //glClear(GL_COLOR_BUFFER_BIT);         // Clear the color buffer

   //double height = glutGet(GLUT_SCREEN_HEIGHT);
   //double width = glutGet(GLUT_SCREEN_WIDTH);
   //glClearColor(0.0, 0.0, 0.0, 0.0); // Set background color to black
   //glClear();
   //glColor3d(0.0, 0.0, 0.0);
    //Komolyan, ezt nem értem.
    //glRectf(-16.0, 16.0, 16.0, -16.0);  // draw rect
    //glEnable(GL_BLEND);
    //glBlendFunc(GL_SRC_ALPHA, GL_ONE);
    //glFlush();  // Render now

    //glutSwapBuffers();
   
   //glutPassiveMotionFunc(&display);

   glutDisplayFunc(display); // Register display callback handler for window re-paint

   glutIdleFunc(&display);
   
    glutMainLoop();           // Enter the infinitely event-processing loop
  
   
   
   return 0;
} 
 //Meg kell oldani a reagálást a billentyűzetre, mert így ha ezt elindítjuk,
 //a gépet is újra kell indítani
/* Main function: GLUT runs as a console application starting at main()  */
int main(int argc, char** argv) {
   //srand(time(NULL));
   return init(argc, argv);
}