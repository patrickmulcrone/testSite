int maxParticles=40; // max number of particles. real particles count depends on ppf and its lifetime
int addPPF=2;         // number of particles per frame added
ArrayList particles;
  
void setup(){
  size(1000,300);
  frameRate(30);
  smooth();
  background(#eaeaea);
  noStroke();
    
  particles = new ArrayList();
}
  
void draw(){
  background(#eaeaea); // overpaint circles the frame before
    
  if(particles.size()<maxParticles){
    /* add particle(s) */
    for(int i=1; i<=addPPF; i++){
      particles.add(new Particles());
    }
  }
  
  /* run trought all Balls and make some action */
  for(int j=0; j<particles.size(); j++){
    Particles particle = (Particles)particles.get(j);
    /* if particle still alive */
    if( particle.alive() ){
      /* update x/y positions */
      particle.position();
      /* now draw as cirle */
      fill(219,94,61, particle.lt);
      ellipse(particle.x, particle.y, particle.r, particle.r);
    }else{
      /* if lifetime is running out, delete */
      particles.remove(j);
    }
  }
}
  
public class Particles {
  float r, x, y, _x, _y, dx=0, dy=0, lt;
     
  /* init start-values */
  public Particles() {
    /* start position center */
    x=-30;
    y=150;
    /* now random values to make it non-linear */
    lt=random(50,200);       // lifetime in frames
    r=random(20, 50);        // circle Radius
    _x=random(0, 0.3);    // stepwidth in x-pos (left, right)
    _y=random(-0.3, 0.3);    // stepwidth in y-pos (up, down)
  }
  
  public void position() {
    /* stepwidth increases, circlespeed is exponential */
    dx+=_x;
    dy+=_y;
    x+=dx;
    y+=dy;
  }
  
  public boolean alive(){
     if(lt<=0){ return false; }else{ lt--; return true; }
  }
}

