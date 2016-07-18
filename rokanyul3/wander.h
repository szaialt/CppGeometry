#include <mutex>              // std::mutex, std::unique_lock
#include "primitive_structs.h"

class wander {
  private:
    int width; // a bolyongó mátrixának szélessége
    int height; // a bolyongó mátrixának magassága
    point position; // a bolyongó helye
  public:
    wander(int width, int height, point position);
    wander(int width, int height, int x, int y);
    int get_width();
    int get_height();
    point get_position();
    void go(); // egy bolyongási lépés megtétele
    void go(int ll); // egy lépés a megadott irányba; ha nem lehet továbblépni, akkor 
    //visszapattan
};

