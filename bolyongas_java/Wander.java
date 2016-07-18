import javax.swing.text.BadLocationException;
import java.util.Random;

class Wander {
    private int width;
    private int height;
    private Point position;
    private Random random;

    public Wander(int width, int height, Point position, Random rnd){
      this.width = width;
      this.height = height;
      this.position = new Point();
      this.position.setX(position.getX());
      this.position.setY(position.getY());
      this.random = rnd;
    }

    public Wander(int width, int height, int x, int y, Random rnd){
      this.width = width;
      this.height = height;
      this.position = new Point();
      this.position.setX(x);
      this.position.setY(y);
      this.random = rnd;
    }

    public int getWidth(){
      int w = this.width;
      return w;
    }

    public int getHeight(){
      int h = this.width;
      return h;
    }

    public Point getPosition(){
      Point p = new Point();
      p.setX(this.position.getX());
      p.setY(this.position.getY());
      return p;
    }

    public void go() throws PositionException, BadLocationException {
      int l = 0;
      int n = width;
      int m = height;
      if ((position.getX() > 0) && (position.getX() < n-1) && 
        (position.getY() > 0) && (position.getY() < m-1)){
        l = random.nextInt()% 8;
      }
     //bal
     else if ((position.getX() == 0) && (position.getY() > 0) && (position.getY() < m-1)){
       l = random.nextInt()% 5;
     }
     //jobb
    else if ((position.getX() == n-1) && (position.getY() > 0) && (position.getY() < m-1)){
       l = (5 + random.nextInt()% 4) % 8;
     }
    //felső
    else if ((position.getX() > 0) && (position.getX() < n-1) && (position.getY() == 0)){
       l = 2 + random.nextInt()% 5;
    }
    //alsó
    else if ((position.getX() > 0) && (position.getX() < n-1) && (position.getY() == m-1)){
      l = (6 + random.nextInt()% 5) % 8;
    }
    //bal felső
    else if ((position.getX() == 0) && (position.getY() == 0)){
      l = 2 + random.nextInt()% 3;   
    }
    //bal alsó
    else if ((position.getX() == 0) && (position.getY() == m-1)){
      l = random.nextInt()% 3;  
    }
    //jobb felső
    else if ((position.getX() == n-1) && (position.getY() == 0)){
      l = 4 + random.nextInt()% 3;  
    }
  //jobb alsó
    else if ((position.getX() == n-1) && (position.getY() == m-1)){
      l = (6 + random.nextInt()% 3) % 8;
    }
    else throw new PositionException(position);
  
    if (l == 0) {
      position.setY(position.getY()-1);
    }
    else if (l == 1) {
      position.setX(position.getX()+1);
      position.setY(position.getY()-1);
    }
    else if (l == 2) {
      position.setX(position.getX()+1);
    }
    else if (l == 3) {
      position.setX(position.getX()+1);
      position.setY(position.getY()+1);
    }
    else if (l == 4) {
      position.setY(position.getY()+1);
    }
    else if (l == 5) {
      position.setX(position.getX()-1);
      position.setY(position.getY()+1);
    }
    else if (l == 6) {
      position.setX(position.getX()-1);
    }
    else if (l == 7) {
      position.setX(position.getX()-1);
      position.setY(position.getY()-1);
    }
    //Nincs ilyen számmal jelzett irány
    else throw new BadLocationException("Érvénytelen elmozdulás.\n", l);
  }
}