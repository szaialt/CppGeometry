#include "generate_color.cc"
#include <iostream>

using namespace std;

int main(int argc, char *argv[]) {
  srand(time(NULL));
  color col = generate_color(255);
  cout << "(" << col.red << ", " << col.green << ", ";
  cout << col.blue << ")" << endl;
}