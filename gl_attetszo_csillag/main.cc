/*
 * GL01Hello.cpp: Test OpenGL C/C++ Setup
 */
//#include <windows.h>  // For MS Windows
#include <GL/glut.h>  // GLUT, includes glu.h and gl.h
#include "polygon.h"

using namespace std;

int approximately(int x, int y, int d) {
  if (((x-y) < d) || ((y-x) < d)) return 0;
  else return 1;
}  
 
int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

double random_double(){ return (double)rand() / RAND_MAX; }  
 
/* Handler for window-repaint event. Call back when the window first appears and
   whenever the window needs to be re-painted. */
void display() {

   GLint m_viewport[4];
  glGetIntegerv( GL_VIEWPORT, m_viewport );
  int height = glutGet(GLUT_SCREEN_HEIGHT);
  int width = glutGet(GLUT_SCREEN_WIDTH);
    //int maxSize = 1;//(min(width/10, height/10));
   // int minSize = maxSize/4;
    const int colorMaxValue = 1;
    const int coldist = 30;
    const int maxSide = 12;
    const int degrees = 360;
    const int maxSymmetry = 12;
    // Itt rajzolj
   // srand(time(NULL));
    int i;
    int time = 0;
    int tick = 1;
    bool t = true;
//    for (int k = 0; k < 100; k++){
//    while(t){
    int symmetry = 3 + rand() % (maxSymmetry - 3);
        
//       int delt = 40;
//       int del = rand() % delt;
//       
//       if (del == 0){
//         //Fill the surface white 
//         SDL_FillRect( screen, NULL, SDL_MapRGB( 
//         screen->format, 0xFF, 0xFF, 0xFF ) );       
//       }
//       else {  
         
       double d = random_double();
       int n = rand() % (maxSide - 3) + 3;
       int alpha = rand() % degrees;
       double x = random_double() - 0.5;
       double y = random_double() - 0.5;
       point p;
       p.x = x;
       p.y = y;
       color col;
       //Miért mindig ugyanaz a három szám?
       col.red = random_double();
       col.green= random_double();
       col.blue = random_double();
       //srand(col.red + col.green + col.blue);
       //color col = generate_color(colorMaxValue);
       Polygon polygon = Polygon(n, alpha, degrees, 1, p, col);
       vector<Polygon> polygons = vector<Polygon>();
       //polygon.draw(screen, d);
       //Ide kellenek az elforgatottak/tükrözöttek
       int delta = degrees/symmetry;
        for (int i = 0; i < symmetry; i++){
          polygons.push_back(polygon.rotate(width/2, height/2, delta*i));  
        }
        for (int i = 0; i < polygons.size(); i++){
          polygons.at(i).draw(d);
        }
     /* eddig elvegzett rajzolasok a kepernyore */
     glFlush();  // Render now
     glutSwapBuffers();

     time = time + tick;
     sleep( tick ); 
//    } 
}
 
void keyPressed(unsigned char key, int x, int y){
  exit(0);
} 
 
 
int init(int argc, char** argv){
   glutInit(&argc, argv);                 // Initialize GLUT
   glutInitDisplayMode(GLUT_SINGLE|GLUT_RGB);
   glutCreateWindow("OpenGL Setup Test"); // Create a window with the given title
   glutFullScreen();  /* Go to full screen */ 
   glutKeyboardFunc(keyPressed);
   glClear(GL_COLOR_BUFFER_BIT);         // Clear the color buffer

   //double height = glutGet(GLUT_SCREEN_HEIGHT);
   //double width = glutGet(GLUT_SCREEN_WIDTH);
   glClearColor(0.0, 0.0, 0.0, 1.0); // Set background color to black 
   //glColor3d(0.0, 0.0, 0.0);
    //Komolyan, ezt nem értem.
    //glRectf(-16.0*width, 16.0*width, 16.0*width, -16.0*width);  // draw rect
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE);
    glFlush();  // Render now

    glutSwapBuffers();
   
   

   glutDisplayFunc(display); // Register display callback handler for window re-paint

   
   
   
   
   glutMainLoop();           // Enter the infinitely event-processing loop
   return 0;
} 
 //Meg kell oldani a reagálást a billentyűzetre, mert így ha ezt elindítjuk,
 //a gépet is újra kell indítani
/* Main function: GLUT runs as a console application starting at main()  */
int main(int argc, char** argv) {
   srand(time(NULL));
   return init(argc, argv);
}