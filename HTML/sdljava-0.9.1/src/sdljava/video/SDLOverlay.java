package sdljava.video;
/**
 *  sdljava - a java binding to the SDL API
 *  Copyright (C) 2004  Ivan Z. Ganza
 * 
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 * 
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 * 
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA
 *
 *  Ivan Z. Ganza (ivan_ganza@yahoo.com)
 */
import java.awt.Rectangle;


/**
 * A SDL_Overlay is similar to a SDL_Surface except it stores a YUV overlay.
 * All the fields are read only, except for pixels which should be locked before use.
 * The format field stores the format of the overlay which is one of the following:
 *
 * <code><pre>
 * #define SDL_YV12_OVERLAY  0x32315659  // Planar mode: Y + V + U
 * #define SDL_IYUV_OVERLAY  0x56555949  // Planar mode: Y + U + V
 * #define SDL_YUY2_OVERLAY  0x32595559  // Packed mode: Y0+U0+Y1+V0
 * #define SDL_UYVY_OVERLAY  0x59565955  // Packed mode: U0+Y0+V0+Y1
 * #define SDL_YVYU_OVERLAY  0x55595659  // Packed mode: Y0+V0+Y1+U0
 * </code></pre>
 * <P>
 * Also see the documentation here:
 *     <a href="http://www.libsdl.org/cgi/docwiki.cgi/SDL_5fOverlay">SDL_Overlay</a>
 *
 * @author Ivan Z. Ganza
 * @version $Id: SDLOverlay.java,v 1.4 2004/12/24 17:32:17 ivan_ganza Exp $
 * @todo Finish SWIG integration
 */
public class SDLOverlay {

    /* Lock an overlay for direct access, and unlock it when you are done */
    public native boolean lockYUVOverlay();
    public native void unlockYUVOverlay();

    /**
       Blit a video overlay to the display surface.
       The contents of the video surface underneath the blit destination are
       not defined.  
       The width and height of the destination rectangle may be different from
       that of the overlay, but currently only 2x scaling is supported.
    */
    public native boolean displayYUVOverlay(Rectangle dstrect);

    
}
