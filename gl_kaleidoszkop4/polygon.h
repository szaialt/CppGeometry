#define _USE_MATH_DEFINES
#include <math.h>
#include <GL/glut.h>  // GLUT, includes glu.h and gl.h
#include <time.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <vector>

typedef struct color {
  double red;
  double green;
  double blue;
} color;

typedef struct point {
  double x;
  double y;
} point;

class Polygon {
    int n;
    int alpha;
    int degrees;
    int birth_time;
    point center;
    color col;
  public:    
    Polygon(int n, int alpha, int degrees, int birth_time, point p, color col);
    std::vector<point> polygon(double t, int dx = 0, int dy = 0);
    void draw(double t);
    Polygon rotate(int u, int v, int delta);
    color getColor();
    point getCenter();
    int getN();

    void setColor(color col);
};

