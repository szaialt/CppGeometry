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

class Elem {
  int n;
  int R;
  int alpha;
  int beta;
  int degrees;
  point center;
  color col;
  int flag;
  public:    
    Elem(int n, int R, int alpha, int beta, int degrees, point center, 
         color col, int flag=0);
    std::vector<point> elem(int dx = 0, int dy = 0);
    void draw(SDL_Surface *screen, int t);
    Elem rotate(double u, double v, int delta);
    Elem mirror_horizontal(int h);
    Elem mirror_vertical(int w);
    color getColor();
    void setColor(color col);
    int getFlag();
    void setFlag(int flag);
    void incrFlag();

};

