/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version: 1.3.22
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

package sdljava.x.swig;

public final class SDL_GLattr {
  public final static SDL_GLattr SDL_GL_RED_SIZE = new SDL_GLattr("SDL_GL_RED_SIZE");
  public final static SDL_GLattr SDL_GL_GREEN_SIZE = new SDL_GLattr("SDL_GL_GREEN_SIZE");
  public final static SDL_GLattr SDL_GL_BLUE_SIZE = new SDL_GLattr("SDL_GL_BLUE_SIZE");
  public final static SDL_GLattr SDL_GL_ALPHA_SIZE = new SDL_GLattr("SDL_GL_ALPHA_SIZE");
  public final static SDL_GLattr SDL_GL_BUFFER_SIZE = new SDL_GLattr("SDL_GL_BUFFER_SIZE");
  public final static SDL_GLattr SDL_GL_DOUBLEBUFFER = new SDL_GLattr("SDL_GL_DOUBLEBUFFER");
  public final static SDL_GLattr SDL_GL_DEPTH_SIZE = new SDL_GLattr("SDL_GL_DEPTH_SIZE");
  public final static SDL_GLattr SDL_GL_STENCIL_SIZE = new SDL_GLattr("SDL_GL_STENCIL_SIZE");
  public final static SDL_GLattr SDL_GL_ACCUM_RED_SIZE = new SDL_GLattr("SDL_GL_ACCUM_RED_SIZE");
  public final static SDL_GLattr SDL_GL_ACCUM_GREEN_SIZE = new SDL_GLattr("SDL_GL_ACCUM_GREEN_SIZE");
  public final static SDL_GLattr SDL_GL_ACCUM_BLUE_SIZE = new SDL_GLattr("SDL_GL_ACCUM_BLUE_SIZE");
  public final static SDL_GLattr SDL_GL_ACCUM_ALPHA_SIZE = new SDL_GLattr("SDL_GL_ACCUM_ALPHA_SIZE");
  public final static SDL_GLattr SDL_GL_STEREO = new SDL_GLattr("SDL_GL_STEREO");
  public final static SDL_GLattr SDL_GL_MULTISAMPLEBUFFERS = new SDL_GLattr("SDL_GL_MULTISAMPLEBUFFERS");
  public final static SDL_GLattr SDL_GL_MULTISAMPLESAMPLES = new SDL_GLattr("SDL_GL_MULTISAMPLESAMPLES");

  public final int swigValue() {
    return swigValue;
  }

  public String toString() {
    return swigName;
  }

  public static SDL_GLattr swigToEnum(int swigValue) {
    if (swigValue < swigValues.length && swigValues[swigValue].swigValue == swigValue)
      return swigValues[swigValue];
    for (int i = 0; i < swigValues.length; i++)
      if (swigValues[i].swigValue == swigValue)
        return swigValues[i];
    throw new IllegalArgumentException("No enum " + SDL_GLattr.class + " with value " + swigValue);
  }

  private SDL_GLattr(String swigName) {
    this.swigName = swigName;
    this.swigValue = swigNext++;
  }

  private SDL_GLattr(String swigName, int swigValue) {
    this.swigName = swigName;
    this.swigValue = swigValue;
    swigNext = swigValue+1;
  }

  private static SDL_GLattr[] swigValues = { SDL_GL_RED_SIZE, SDL_GL_GREEN_SIZE, SDL_GL_BLUE_SIZE, SDL_GL_ALPHA_SIZE, SDL_GL_BUFFER_SIZE, SDL_GL_DOUBLEBUFFER, SDL_GL_DEPTH_SIZE, SDL_GL_STENCIL_SIZE, SDL_GL_ACCUM_RED_SIZE, SDL_GL_ACCUM_GREEN_SIZE, SDL_GL_ACCUM_BLUE_SIZE, SDL_GL_ACCUM_ALPHA_SIZE, SDL_GL_STEREO, SDL_GL_MULTISAMPLEBUFFERS, SDL_GL_MULTISAMPLESAMPLES };
  private static int swigNext = 0;
  private final int swigValue;
  private final String swigName;
}

