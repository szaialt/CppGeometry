#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include <math.h>
 
int main(int argc, char *argv[]) {
    SDL_Event ev;
    SDL_Surface *screen;
    int x, y, r;
 
    /* SDL inicializálása és ablak megnyitása */
    SDL_Init(SDL_INIT_VIDEO);
    screen=SDL_SetVideoMode(500, 500, 0, SDL_ANYFORMAT);
    if (!screen) {
        fprintf(stderr, "Nem sikerult megnyitni az ablakot!\n");
        exit(1);
    }
    SDL_WM_SetCaption("SDL peldaprogram", "SDL peldaprogram");
 
    r = 20;
    
    aacircleRGBA(screen, 50, 50, r, 255, 0, 0, 255);
    filledCircleRGBA(screen, 50, 50, r/2, 255, 0, 0, 255);
    aacircleRGBA(screen, 450, 50, r, 255, 0, 0, 255); 
    filledCircleRGBA(screen, 450, 50, r/2, 255, 0, 0, 255);
    aacircleRGBA(screen, 50, 450, r, 255, 0, 0, 255);
    filledCircleRGBA(screen, 50, 450, r/2, 255, 0, 0, 255);
    aacircleRGBA(screen, 450, 450, r, 255, 0, 0, 255); 
    filledCircleRGBA(screen, 450, 450, r/2, 255, 0, 0, 255);
    
    filledEllipseRGBA(screen, 150, 50, r, r/2, 0, 255, 0, 255);
    filledEllipseRGBA(screen, 350, 50, r, r/2, 0, 255, 0, 255); 
    filledEllipseRGBA(screen, 150, 450, r, r/2, 0, 255, 0, 255);
    filledEllipseRGBA(screen, 350, 450, r, r/2, 0, 255, 0, 255); 
    filledEllipseRGBA(screen, 50, 150, r/2, r, 0, 255, 0, 255);
    filledEllipseRGBA(screen, 450, 150, r/2, r, 0, 255, 0, 255); 
    filledEllipseRGBA(screen, 50, 350, r/2, r, 0, 255, 0, 255);
    filledEllipseRGBA(screen, 450, 350, r/2, r, 0, 255, 0, 255);   
    /* szoveg */
//    stringRGBA(screen, 110, 350, "Kilepeshez: piros x az ablakon", 255, 255, 255, 255);
 
    /* eddig elvegzett rajzolasok a kepernyore */
    SDL_Flip(screen);
 
    /* varunk a kilepesre */
    while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT) {
    }
 
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}