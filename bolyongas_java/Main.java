/* classpathba:
/media/UJADATOK/Dokumentumok/jegyzetek/Programozas/Kepernyovedok/
Segedanyagok/HTML/sdljava-0.9.1/lib/sdljava.jar
javac -cp jarom.jar
*/

import java.util.Vector;
import java.util.Random;
import sdljava.video.SDLColor;
import sdljava.SDLMain;
import sdljava.event.SDLEvent;
import sdljava.x.swig.SDL_Surface;
import sdljava.video.SDLVideo;
import sdljava.x.swig.SWIG_SDLGfx;
import sdljava.x.swig.SWIG_SDLVideo;
import sdljava.x.swig.SWIG_SDLMain;
import sdljava.event.SDLQuitEvent;
import sdljava.event.SDLKeyboardEvent;
import sdljava.event.DummyEvent;
import sdljava.SDLException;

public class Main {

  //std::condition_variable cv;
  //std::mutex mtx;
  static final int threadNumber = 24; // kell: legalább ennyi színt generálni 
  //a generateColors függvényben
  //Barrier* barrier = new Barrier(threadNumber+1);
  static Vector<Wander> Wanders;

  private static int min(int a, int b){
    if (a < b) return a;
    else return b;
  } 

  private static int max(int a, int b){
    if (a > b) return a;
    else return b;
  } 

  private static Vector<SDLColor> generateColors(int colorMaxValue){
    Vector<SDLColor> colors = new Vector<SDLColor>();
    SDLColor col = new SDLColor();
    //fehér
      col.setRed(colorMaxValue);
      col.setGreen(colorMaxValue);
      col.setBlue(colorMaxValue);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //rózsaszín
      col.setRed(colorMaxValue);
      col.setGreen(colorMaxValue/2);
      col.setBlue(colorMaxValue/2);  
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //világoskék
      col.setRed(colorMaxValue/2);
      col.setGreen(colorMaxValue/2);
      col.setBlue(colorMaxValue);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //piros
      col.setRed(colorMaxValue);
      col.setGreen(0);
      col.setBlue(0);  
      col.setAlpha(colorMaxValue);
    colors.add(col);
       //sárga
      col.setRed(colorMaxValue);
      col.setGreen(colorMaxValue);
      col.setBlue(0);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //lila
      col.setRed(colorMaxValue/2);
      col.setGreen(colorMaxValue/4);
      col.setBlue(colorMaxValue);
      col.setAlpha(colorMaxValue);
    colors.add(col);
       //zöld
      col.setRed(0);
      col.setGreen(colorMaxValue/2);
      col.setBlue(0);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //bordó
      col.setRed(colorMaxValue/2);
      col.setGreen(0);
      col.setBlue(0);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //kék
      col.setRed(0);
      col.setGreen(0);
      col.setBlue(colorMaxValue);      
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //narancssárga
      col.setRed(colorMaxValue);
      col.setGreen(colorMaxValue/2);
      col.setBlue(0);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //narancssárga
      col.setRed(colorMaxValue);
      col.setGreen(colorMaxValue/4);
      col.setBlue(0);
      col.setAlpha(colorMaxValue);
    colors.add(col);
    //lila
      col.setRed(colorMaxValue/4);
      col.setGreen(0);
      col.setBlue(colorMaxValue/2);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //kék
      col.setRed(colorMaxValue/4);
      col.setGreen(colorMaxValue/2);
      col.setBlue(colorMaxValue);
      col.setAlpha(colorMaxValue);
    colors.add(col);
       //zöld
      col.setRed(0);
      col.setGreen(colorMaxValue);
      col.setBlue(0);
      col.setAlpha(colorMaxValue);
    colors.add(col);
       //sárgászöld
      col.setRed(colorMaxValue/3);
      col.setGreen(colorMaxValue);
      col.setBlue(0);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //bíbor
      col.setRed(colorMaxValue/2);
      col.setGreen(0);
      col.setBlue(colorMaxValue/4);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //kékeszöld
      col.setRed(0);
      col.setGreen(colorMaxValue/2);
      col.setBlue(colorMaxValue/2);      
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //sötétkék
      col.setRed(0);
      col.setGreen(0);
      col.setBlue(colorMaxValue/2);      
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //kékeslila
      col.setRed(colorMaxValue/4);
      col.setGreen(0);
      col.setBlue(colorMaxValue/2);      
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //rózsaszín
      col.setRed(colorMaxValue);
      col.setGreen(colorMaxValue/3);
      col.setBlue(colorMaxValue/3);  
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //piros
      col.setRed(colorMaxValue);
      col.setGreen(0);
      col.setBlue(colorMaxValue/16);  
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //lila
      col.setRed(colorMaxValue/3);
      col.setGreen(colorMaxValue/16);
      col.setBlue(colorMaxValue);
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //barna
      col.setRed(colorMaxValue/2);
      col.setGreen(colorMaxValue/4);
      col.setBlue(colorMaxValue/4);  
      col.setAlpha(colorMaxValue);
    colors.add(col);
      //rózsaszín
      col.setRed(colorMaxValue);
      col.setGreen(0);
      col.setBlue(colorMaxValue/4);
      col.setAlpha(colorMaxValue);
    colors.add(col);

    return colors;    
  }

  private static Vector <Vector<Integer> > 
  generateNullMatrix(int n, int m){
    Vector<Vector<Integer> > matrix = new Vector<Vector<Integer> >();
    for (int i = 0; i < n; i++){
      Vector<Integer> v = new Vector<Integer>();
      for (int j = 0; j < m; j++){
        v.add(0);
      }
      matrix.add(v);
    }
    return matrix;
  } 

   //Miért nem fordul????
  private static Vector <Vector<Integer> > 
    generateMatrix(int n, int m, Vector<Wander> Wanders){
    Vector<Vector<Integer> > matrix = generateNullMatrix(n, m);
    for (int i = 0; i < Wanders.size(); i++){
      Point p = Wanders.elementAt(i).getPosition();
      matrix.elementAt(p.getX()).set(p.getY(), i+1);
    }
    return matrix;
  }  

  public static void main(String [ ] args) {
    SDLEvent ev = new DummyEvent();
    SDL_Surface screen;
 
    try {
      /* SDL inicializálása és ablak megnyitása */
      SDLMain.init(SDLMain.SDL_INIT_VIDEO);
      screen = new SDL_Surface();
      screen.setFlags(SDLVideo.SDL_ANYFORMAT+ 
                   SDLVideo.SDL_FULLSCREEN+
                   SDLVideo.SDL_RESIZABLE+ 
                   SDLVideo.SDL_DOUBLEBUF);
      /*screen= SDLVideo.setVideoMode(0, 0, 0, SDLVideo.SDL_ANYFORMAT+ 
                   SDLVideo.SDL_FULLSCREEN+
                   SDLVideo.SDL_RESIZABLE+ 
                   SDLVideo.SDL_DOUBLEBUF);*/
      
      SDLVideo.wmSetCaption("SDL peldaprogram", "SDL peldaprogram");
  
      int width = screen.getW();
      int height = screen.getH(); 
      int cellSize = 10;
      final int colorMaxValue = 255;

      // Itt rajzolj
      Random rnd = new Random();
      final int n = width/cellSize;
      final int m = height/cellSize;
    
      Vector<SDLColor> colors = generateColors(colorMaxValue);
      int index = rnd.nextInt() % threadNumber;
      SDLColor col = colors.elementAt(index);

      Vector<Point> points = new Vector<Point>();
      for (int i = 0; i < threadNumber; i++){
        int vx = rnd.nextInt();
        int vy = rnd.nextInt();
        int x2 = vx % n;
        int y2 = vy % m;
        Point p = new Point();;
        p.setX(x2);
        p.setY(y2); 
        points.add(p);
      }
    
      //Vector<Wander> Wanders;
    
      for (int i = 0; i < threadNumber; i++){
        Wander wander = new Wander(n, m, points.elementAt(i), rnd);
        Wanders.add(wander);
      }
        
      Vector<Vector<Integer> > cellMatrix = generateMatrix(n, m, Wanders);        

      Vector<Boolean> flags = new Vector<Boolean>();  
      for (int i = 0; i < threadNumber; i++){
        flags.add(true);
      }
    
      Thread[] t = new WandererThread[threadNumber];

      //Launch a group of threads
      for (int i = 0; i < colors.size(); ++i) {
        t[i] = new WandererThread(flags.elementAt(i), 
                Wanders.elementAt(i), i, n, m);
        t[i].run();
      }
    
      while ((ev.getClass().equals(SDLQuitEvent.class) == false)  && (ev.getClass().equals(SDLKeyboardEvent.class)) == false){
        cellMatrix = generateMatrix(n, m, Wanders);        

        for (int i = 0; i < n; i++){
          for (int j = 0; j < m; j++){
            short x1 = (short)(i*cellSize + 1);
            short y1 = (short)(j*cellSize + 1);  
            short x2 = (short)((i+1)*cellSize);
            short y2 = (short)((j+1)*cellSize); 
            int colorNum = cellMatrix.elementAt(i).elementAt(j);
            if (colorNum == 0){
             SWIG_SDLGfx.boxRGBA(screen, x1, y1, x2, y2,
              (short)0, (short)0, (short)0, (short)colorMaxValue);   
            }
            else {
              SDLColor color = colors.elementAt(colorNum - 1);
              SWIG_SDLGfx.boxRGBA(screen, x1, y1, x2, y2,
              (short)color.getRed(), (short)color.getGreen(), (short)color.getBlue(), (short)color.getAlpha());
            }
                 
          }
        }        
      
    
    
     /* eddig elvegzett rajzolasok a kepernyore */
     SWIG_SDLVideo.SDL_Flip(screen);
     
     //cv.notify_all();

      try {
        Thread.sleep(1); 
      }
      catch (InterruptedException ex){
        System.err.println(ex);
      }    
      //   barrier.Wait();
    }


          //exit(1);

    }
 
    catch (SDLException ex) {
      System.err.println("Nem sikerult megnyitni az ablakot!");
      System.err.println(ex);

      }
           //Join the threads with the main thread
 /*     for (int i = 0; i < colors.size(); ++i) {
        t[i].join();
    }        
        
 
    /* ablak bezarasa */
    SWIG_SDLMain.SDL_Quit();
 
  }
}