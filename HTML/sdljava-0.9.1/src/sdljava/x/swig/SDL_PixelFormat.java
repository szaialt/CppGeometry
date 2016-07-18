/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version: 1.3.22
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

package sdljava.x.swig;

public class SDL_PixelFormat {
  private long swigCPtr;
  protected boolean swigCMemOwn;

  protected SDL_PixelFormat(long cPtr, boolean cMemoryOwn) {
    swigCMemOwn = cMemoryOwn;
    swigCPtr = cPtr;
  }

  protected static long getCPtr(SDL_PixelFormat obj) {
    return (obj == null) ? 0 : obj.swigCPtr;
  }

  protected void finalize() {
    delete();
  }

  public void delete() {
    if(swigCPtr != 0 && swigCMemOwn) {
      swigCMemOwn = false;
      SWIG_SDLVideoJNI.delete_SDL_PixelFormat(swigCPtr);
    }
    swigCPtr = 0;
  }

  public void setPalette(SDL_Palette palette) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_palette(swigCPtr, SDL_Palette.getCPtr(palette));
  }

  public SDL_Palette getPalette() {
    long cPtr = SWIG_SDLVideoJNI.get_SDL_PixelFormat_palette(swigCPtr);
    return (cPtr == 0) ? null : new SDL_Palette(cPtr, false);
  }

  public void setBitsPerPixel(short BitsPerPixel) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_BitsPerPixel(swigCPtr, BitsPerPixel);
  }

  public short getBitsPerPixel() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_BitsPerPixel(swigCPtr);
  }

  public void setBytesPerPixel(short BytesPerPixel) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_BytesPerPixel(swigCPtr, BytesPerPixel);
  }

  public short getBytesPerPixel() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_BytesPerPixel(swigCPtr);
  }

  public void setRloss(short Rloss) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Rloss(swigCPtr, Rloss);
  }

  public short getRloss() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Rloss(swigCPtr);
  }

  public void setGloss(short Gloss) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Gloss(swigCPtr, Gloss);
  }

  public short getGloss() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Gloss(swigCPtr);
  }

  public void setBloss(short Bloss) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Bloss(swigCPtr, Bloss);
  }

  public short getBloss() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Bloss(swigCPtr);
  }

  public void setAloss(short Aloss) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Aloss(swigCPtr, Aloss);
  }

  public short getAloss() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Aloss(swigCPtr);
  }

  public void setRshift(short Rshift) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Rshift(swigCPtr, Rshift);
  }

  public short getRshift() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Rshift(swigCPtr);
  }

  public void setGshift(short Gshift) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Gshift(swigCPtr, Gshift);
  }

  public short getGshift() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Gshift(swigCPtr);
  }

  public void setBshift(short Bshift) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Bshift(swigCPtr, Bshift);
  }

  public short getBshift() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Bshift(swigCPtr);
  }

  public void setAshift(short Ashift) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Ashift(swigCPtr, Ashift);
  }

  public short getAshift() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Ashift(swigCPtr);
  }

  public void setRmask(long Rmask) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Rmask(swigCPtr, Rmask);
  }

  public long getRmask() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Rmask(swigCPtr);
  }

  public void setGmask(long Gmask) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Gmask(swigCPtr, Gmask);
  }

  public long getGmask() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Gmask(swigCPtr);
  }

  public void setBmask(long Bmask) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Bmask(swigCPtr, Bmask);
  }

  public long getBmask() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Bmask(swigCPtr);
  }

  public void setAmask(long Amask) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_Amask(swigCPtr, Amask);
  }

  public long getAmask() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_Amask(swigCPtr);
  }

  public void setColorkey(long colorkey) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_colorkey(swigCPtr, colorkey);
  }

  public long getColorkey() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_colorkey(swigCPtr);
  }

  public void setAlpha(short alpha) {
    SWIG_SDLVideoJNI.set_SDL_PixelFormat_alpha(swigCPtr, alpha);
  }

  public short getAlpha() {
    return SWIG_SDLVideoJNI.get_SDL_PixelFormat_alpha(swigCPtr);
  }

  public SDL_PixelFormat() {
    this(SWIG_SDLVideoJNI.new_SDL_PixelFormat(), true);
  }

}