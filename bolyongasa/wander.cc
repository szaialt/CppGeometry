#include <time.h>
#include <stdlib.h>
#include <unistd.h>
#include "wander.h"

wander::wander(int width, int height, point position){
  this->width = width;
  this->height = height;
  this->position = position;
}

wander::wander(int width, int height, int x, int y){
  this->width = width;
  this->height = height;
  this->position.x = x;
  this->position.y = y;
}

int wander::get_width(){
  int w = this->width;
  return w;
}

int wander::get_height(){
  int h = this->width;
  return h;
}

point wander::get_position(){
  point p;
  p.x = this->position.x;
  p.y = this->position.y;
  return p;
}

void wander::go(){
  int l = 0;
  int m = width;
  int n = height;
  if ((position.x > 0) && (position.x < n-1) && 
    (position.y > 0) && (position.y < m-1)){
    l = rand() % 8;
  }
  //bal
  else if ((position.x == 0) && (position.y > 0) && (position.y < m-1)){
    l = rand() % 5;
  }
  //jobb
  else if ((position.x == n-1) && (position.y > 0) && (position.y < m-1)){
    l = (5 + rand() % 4) % 8;
  }
  //felső
  else if ((position.x > 0) && (position.x < n-1) && (position.y == 0)){
    l = 2 + rand() % 5;
  }
  //alsó
  else if ((position.x > 0) && (position.x < n-1) && (position.y == m-1)){
    l = (6 + rand() % 5) % 8;
  }
  //bal felső
  else if ((position.x == 0) && (position.y == 0)){
    l = 2 + rand() % 3;   
  }
  //bal alsó
  else if ((position.x == 0) && (position.y == m-1)){
    l = rand() % 3;  
  }
  //jobb felső
  else if ((position.x == n-1) && (position.y == 0)){
    l = 4 + rand() % 3;  
  }
  //jobb alsó
  else if ((position.x == n-1) && (position.y == m-1)){
    l = (6 + rand() % 3) % 8;
  }
  else throw false;
  
  if (l == 0) {
    position.y--;
  }
  else if (l == 1) {
    position.x++;
    position.y--;
  }
  else if (l == 2) {
    position.x++;
  }
  else if (l == 3) {
    position.x++;
    position.y++;
  }
  else if (l == 4) {
    position.y++;
  }
  else if (l == 5) {
    position.x--;
    position.y++;
  }
  else if (l == 6) {
    position.x--;
  }
  else if (l == 7) {
    position.x--;
    position.y--;
  }
  else throw false;
}