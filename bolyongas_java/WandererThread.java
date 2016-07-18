public class WandererThread extends Thread {

  private boolean flag; 
  private Wander wander; 
  private int tid; 
  private int n; 
  private int m;

  public WandererThread(boolean flag, Wander wander, int tid, int n, int m){
    this.flag = flag;
    this.wander = wander;
    this.tid = tid;
    this.n = n;
    this.m = m;
  }
  
  @Override
  public void run() {
   // std::unique_lock<std::mutex> lck(mtx);
   // System.out.println(tid);
    try {
      Thread.sleep(2); 
    }
    catch (InterruptedException ex){
      System.err.println(ex);
    }
    while (flag) {
      //mtx.lock();
      try {
        wander.go();
      }
      catch (PositionException ex){
        Point p = ex.getPoint();
        System.err.println("Hibás hely");
        System.err.println("(" + p.getX() + ", "+ p.getY() + ")");
      }
      catch (javax.swing.text.BadLocationException ex){
        int l = ex.offsetRequested();
        System.err.println("Illegális elmozdulás: "+l);
      }
      //Point p = wander.getPosition();
      //System.out.println("(" + p.getX() + ", "+ p.getY() +")");
     // sleep( 0.5 ); 
      //barrier.Wait();
      //mtx.unlock();
      try {
        Thread.sleep(1); 
      }
      catch (InterruptedException ex){
        System.err.println(ex);
      }
    }

   // cv.wait(lck);
  }

}