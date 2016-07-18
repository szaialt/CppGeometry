/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version: 1.3.22
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

package sdljava.x.swig;

public class SDL_VideoInfo {
  private long swigCPtr;
  protected boolean swigCMemOwn;

  protected SDL_VideoInfo(long cPtr, boolean cMemoryOwn) {
    swigCMemOwn = cMemoryOwn;
    swigCPtr = cPtr;
  }

  protected static long getCPtr(SDL_VideoInfo obj) {
    return (obj == null) ? 0 : obj.swigCPtr;
  }

  protected void finalize() {
    delete();
  }

  public void delete() {
    if(swigCPtr != 0 && swigCMemOwn) {
      swigCMemOwn = false;
      SWIG_SDLVideoJNI.delete_SDL_VideoInfo(swigCPtr);
    }
    swigCPtr = 0;
  }

  public void setHw_available(long hw_available) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_hw_available(swigCPtr, hw_available);
  }

  public long getHw_available() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_hw_available(swigCPtr);
  }

  public void setWm_available(long wm_available) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_wm_available(swigCPtr, wm_available);
  }

  public long getWm_available() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_wm_available(swigCPtr);
  }

  public void setUnusedBits1(long UnusedBits1) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_UnusedBits1(swigCPtr, UnusedBits1);
  }

  public long getUnusedBits1() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_UnusedBits1(swigCPtr);
  }

  public void setUnusedBits2(long UnusedBits2) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_UnusedBits2(swigCPtr, UnusedBits2);
  }

  public long getUnusedBits2() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_UnusedBits2(swigCPtr);
  }

  public void setBlit_hw(long blit_hw) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_blit_hw(swigCPtr, blit_hw);
  }

  public long getBlit_hw() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_blit_hw(swigCPtr);
  }

  public void setBlit_hw_CC(long blit_hw_CC) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_blit_hw_CC(swigCPtr, blit_hw_CC);
  }

  public long getBlit_hw_CC() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_blit_hw_CC(swigCPtr);
  }

  public void setBlit_hw_A(long blit_hw_A) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_blit_hw_A(swigCPtr, blit_hw_A);
  }

  public long getBlit_hw_A() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_blit_hw_A(swigCPtr);
  }

  public void setBlit_sw(long blit_sw) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_blit_sw(swigCPtr, blit_sw);
  }

  public long getBlit_sw() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_blit_sw(swigCPtr);
  }

  public void setBlit_sw_CC(long blit_sw_CC) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_blit_sw_CC(swigCPtr, blit_sw_CC);
  }

  public long getBlit_sw_CC() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_blit_sw_CC(swigCPtr);
  }

  public void setBlit_sw_A(long blit_sw_A) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_blit_sw_A(swigCPtr, blit_sw_A);
  }

  public long getBlit_sw_A() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_blit_sw_A(swigCPtr);
  }

  public void setBlit_fill(long blit_fill) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_blit_fill(swigCPtr, blit_fill);
  }

  public long getBlit_fill() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_blit_fill(swigCPtr);
  }

  public void setUnusedBits3(long UnusedBits3) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_UnusedBits3(swigCPtr, UnusedBits3);
  }

  public long getUnusedBits3() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_UnusedBits3(swigCPtr);
  }

  public void setVideo_mem(long video_mem) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_video_mem(swigCPtr, video_mem);
  }

  public long getVideo_mem() {
    return SWIG_SDLVideoJNI.get_SDL_VideoInfo_video_mem(swigCPtr);
  }

  public void setVfmt(SDL_PixelFormat vfmt) {
    SWIG_SDLVideoJNI.set_SDL_VideoInfo_vfmt(swigCPtr, SDL_PixelFormat.getCPtr(vfmt));
  }

  public SDL_PixelFormat getVfmt() {
    long cPtr = SWIG_SDLVideoJNI.get_SDL_VideoInfo_vfmt(swigCPtr);
    return (cPtr == 0) ? null : new SDL_PixelFormat(cPtr, false);
  }

  public SDL_VideoInfo() {
    this(SWIG_SDLVideoJNI.new_SDL_VideoInfo(), true);
  }

}
