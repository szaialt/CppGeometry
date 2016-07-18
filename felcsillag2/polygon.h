#define _USE_MATH_DEFINES
#include <math.h>
#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include <time.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <vector>

typedef struct color {
  int red;
  int green;
  int blue;
  int alpha;
} color;

typedef struct point {
  int x;
  int y;
} point;

class Polygon {
    int n;
    int alpha;
    int degrees;
    int birth_time;
    point center;
    color col;
  public:    
    Polygon(int maxSide, int degrees, int t0, int height, int width, int maxColor);
    Polygon(int n, int alpha, int degrees, int birth_time, point p, color col);
    int approximately(int x, int y, int d);
    color generate_color(int colorMaxValue);
    std::vector<point> polygon(int r, int dx = 0, int dy = 0);
    std::vector<point> star(int r, int dx = 0, int dy = 0);
    void draw_polygon(SDL_Surface *screen, int r);
    void draw_star(SDL_Surface *screen, int r);
    color getColor();
    void setColor(color col);
};

