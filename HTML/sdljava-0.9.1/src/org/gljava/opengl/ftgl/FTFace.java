/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version: 1.3.22
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

package org.gljava.opengl.ftgl;

public class FTFace {
  private long swigCPtr;
  protected boolean swigCMemOwn;

  protected FTFace(long cPtr, boolean cMemoryOwn) {
    swigCMemOwn = cMemoryOwn;
    swigCPtr = cPtr;
  }

  protected static long getCPtr(FTFace obj) {
    return (obj == null) ? 0 : obj.swigCPtr;
  }

  protected FTFace() {
    this(0, false);
  }

  protected void finalize() {
    delete();
  }

  public void delete() {
    if(swigCPtr != 0 && swigCMemOwn) {
      swigCMemOwn = false;
      SWIG_FTGLJNI.delete_FTFace(swigCPtr);
    }
    swigCPtr = 0;
  }

  public FTFace(String fontFilePath) {
    this(SWIG_FTGLJNI.new_FTFace__SWIG_0(fontFilePath), true);
  }

  public FTFace(SWIGTYPE_p_unsigned_char pBufferBytes, int bufferSizeInBytes) {
    this(SWIG_FTGLJNI.new_FTFace__SWIG_1(SWIGTYPE_p_unsigned_char.getCPtr(pBufferBytes), bufferSizeInBytes), true);
  }

  public boolean Attach(String fontFilePath) {
    return SWIG_FTGLJNI.FTFace_Attach__SWIG_0(swigCPtr, fontFilePath);
  }

  public boolean Attach(SWIGTYPE_p_unsigned_char pBufferBytes, int bufferSizeInBytes) {
    return SWIG_FTGLJNI.FTFace_Attach__SWIG_1(swigCPtr, SWIGTYPE_p_unsigned_char.getCPtr(pBufferBytes), bufferSizeInBytes);
  }

  public SWIGTYPE_p_FT_Face Face() {
    long cPtr = SWIG_FTGLJNI.FTFace_Face(swigCPtr);
    return (cPtr == 0) ? null : new SWIGTYPE_p_FT_Face(cPtr, false);
  }

  public SWIGTYPE_p_FTSize Size(long size, long res) {
    return new SWIGTYPE_p_FTSize(SWIG_FTGLJNI.FTFace_Size(swigCPtr, size, res), false);
  }

  public long CharMapCount() {
    return SWIG_FTGLJNI.FTFace_CharMapCount(swigCPtr);
  }

  public SWIGTYPE_p_FT_Encoding CharMapList() {
    long cPtr = SWIG_FTGLJNI.FTFace_CharMapList(swigCPtr);
    return (cPtr == 0) ? null : new SWIGTYPE_p_FT_Encoding(cPtr, false);
  }

  public SWIGTYPE_p_FTPoint KernAdvance(long index1, long index2) {
    return new SWIGTYPE_p_FTPoint(SWIG_FTGLJNI.FTFace_KernAdvance(swigCPtr, index1, index2), true);
  }

  public SWIGTYPE_p_FT_GlyphSlot Glyph(long index, SWIGTYPE_p_FT_Int load_flags) {
    return new SWIGTYPE_p_FT_GlyphSlot(SWIG_FTGLJNI.FTFace_Glyph(swigCPtr, index, SWIGTYPE_p_FT_Int.getCPtr(load_flags)), true);
  }

  public long GlyphCount() {
    return SWIG_FTGLJNI.FTFace_GlyphCount(swigCPtr);
  }

  public int Error() {
    return SWIG_FTGLJNI.FTFace_Error(swigCPtr);
  }

}
