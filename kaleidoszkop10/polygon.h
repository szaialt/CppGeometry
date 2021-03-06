#pragma once
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
#include "primitive_structs.h"

class Polygon {
    int n;
    int alpha;
    int degrees;
    point center;
    color col;
  public:    
    Polygon(int n, int alpha, int degrees, point p, color col);
    std::vector<point> polygon(int t, int dx = 0, int dy = 0);
    void draw(SDL_Surface *screen, int t);
    Polygon rotate(int u, int v, int delta);
    Polygon mirror(int width);
    color getColor();
    void setColor(color col);
};

