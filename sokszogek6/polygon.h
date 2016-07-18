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
  public:
    Polygon(int maxSide, int degrees, int t0);
    Polygon(int n, int alpha, int degrees, int birth_time);
    std::vector<point> polygon(int t, int dx = 0, int dy = 0);
    void draw(SDL_Surface *screen, point p, int t, color col);
};

