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
 
color generate_color(int colorMax){
     const int coldist = 30;
     int colorMaxValue = colorMax * 255; 
     int red =  rand() / colorMaxValue;
     int green =  rand() / colorMaxValue;
     int blue =  rand() / colorMaxValue;
     //I wish brigth colours
     if (((approximately(red, colorMaxValue/2, coldist) == 0) && 
       (approximately(blue, colorMaxValue/2, coldist) == 0) && 
       (approximately(green, colorMaxValue/2, coldist) == 0))){
         if (red > colorMaxValue/2) 
           red = (red + coldist) % colorMaxValue;
         if (red < colorMaxValue/2) 
           red = (red - coldist) % colorMaxValue;
         if (green > colorMaxValue/2) 
           green = (green + coldist) % colorMaxValue;
         if (green < colorMaxValue/2) 
           green = (green - coldist) % colorMaxValue;
         if (blue > colorMaxValue/2) 
           blue = (blue + coldist) % colorMaxValue;
         if (blue < colorMaxValue/2) 
           blue = (blue - coldist) % colorMaxValue;
     }
     //I hate grey
     if ((approximately(red, green, coldist) == 0) && 
       (approximately(blue, green, coldist) == 0) && 
       (approximately(red, blue, coldist) == 0)){
       int r = red;
       int g = green;
       int b = blue;
        if (approximately(r, g, coldist) == 0) {
           if (r > g) 
             red = (r + coldist) % colorMaxValue;
           if (red < green) 
             red = (r - coldist) % colorMaxValue;
      }
      if (approximately(g, b, coldist) == 0) {
           if (g > b) 
             green = (g + coldist) % colorMaxValue;
           if (green < blue) 
             green = (g - coldist) % colorMaxValue;    
      }        
      if  (approximately(b, r, coldist) == 0) {
           if (b > r) 
             blue = (b + coldist) % colorMaxValue;
           if (blue < red) 
             blue = (b - coldist) % colorMaxValue;    
      }
  


  }
  if (red < 0) red = colorMaxValue + red;
  if (green < 0) green = colorMaxValue + green;
  if (blue < 0) blue = colorMaxValue + blue;
  
  color col;
  col.red = red/255.0;
  col.green = green/255.0;
  col.blue = blue/255.0;
//  double alpha = colorMax;
//  col.alpha = alpha;
  return col;
} 
 
double random_double(){ return (double)rand() / RAND_MAX; } 
 
void draw(Polygon pol, double t){
 
  color col = pol.getColor();
  vector<point> points = pol.polygon(t);
  cout << "(" << col.red << ", " << col.green;
  cout << ", " << col.blue << ")" << endl;
  glBegin(GL_POLYGON);
  glColor3d(col.red, col.blue, col.green);
  int n = pol.getN();
  for (int i = 0; i < n; i++){
    glVertex2d(points.at(i).x, points.at(i).y);
    cout << "\t";
    cout << "(" << points.at(i).x << ", " << points.at(i).y << ")" << endl;
  }
  glEnd();
  glutSwapBuffers();

} 
 
/* Handler for window-repaint event. Call back when the window first appears and
   whenever the window needs to be re-painted. */
void display() {
   glClearColor(0.0, 0.0, 0.0, 1.0); // Set background color to black and opaque
   glClear(GL_COLOR_BUFFER_BIT);         // Clear the color buffer

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
       int vx = rand();
       int vy = rand();
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
       draw(polygon, d);
       //vector<Polygon> polygons = vector<Polygon>();
       //polygon.draw(screen, d);
       //Ide kellenek az elforgatottak/tükrözöttek
       int delta = degrees/symmetry;
//        for (int i = 0; i < symmetry; i++){
//          (polygon.rotate(width/2, height/2, delta*i)).draw(d);
//        }
     /* eddig elvegzett rajzolasok a kepernyore */
     //glFlush();  // Render now
     time = time + tick;
     sleep( tick ); 
       
 
}
 
void keyPressed(unsigned char key, int x, int y){
  exit(0);
} 
 
 
int init(int argc, char** argv){
   glutInit(&argc, argv);                 // Initialize GLUT
   glutInitDisplayMode(GLUT_SINGLE|GLUT_RGB);
   glutCreateWindow("OpenGL Setup Test"); // Create a window with the given title
   glutFullScreen();   
   glutKeyboardFunc(keyPressed);/* Go to full screen */
   glutInitWindowPosition(50, 50); // Position the window's initial top-left corner
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