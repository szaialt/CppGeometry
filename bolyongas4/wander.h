#include <mutex>              // std::mutex, std::unique_lock
#include "primitive_structs.h"

class wander {
  private:
    int width;
    int height;
    point position;
  public:
    wander(int width, int height, point position);
    wander(int width, int height, int x, int y);
    int get_width();
    int get_height();
    point get_position();
    void go();
};
