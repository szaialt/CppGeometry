package sdljava.cdrom;
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
import sdljava.x.swig.*;

/**
 * CD Track Information
 *
 * 
 * @version $Id: SDLCdTrack.java,v 1.3 2004/12/28 18:00:05 ivan_ganza Exp $
 */
public class SDLCdTrack {

    public static final int CD_FPS = 75;

    SDL_CDtrack swigTrack;

    protected SDLCdTrack(SDL_CDtrack swigTrack) {
	this.swigTrack = swigTrack;
    }
    
    /**
     * Get the track number
     *
     * @return the track number
     */
    public int getId() {
	return swigTrack.getId();
    }
    
    /**
     * Get the track type
     *
     * @return the track type
     */
    public TrackType getType() {
	return TrackType.swigToEnum(swigTrack.getType());
    }
    
    /**
     * Get the length (in frames) of this track
     *
     * @return the length (in frames) of this track
     */
    public long getLength() {
	return swigTrack.getLength();
    }
    
    /**
     * Get the frame offset of the beginning of this track
     *
     * @return the frame offset of the beginning of this track
     */
    public long getOffset() {
	return swigTrack.getOffset();
    }

    public FrameInfo getFrameInfo() {
	int[]  m = {0};
	int[]  s = {0};
	int[]  f = {0};

	int frame = (int)getOffset();
	
	SWIG_SDLCdrom.SWIG_framesToMSF(frame, m, s, f);

	return new FrameInfo(frame, m[0], s[0], f[0]);
    }
    
//    /**
//     * Describe <code>framesToMSF</code> method here.
//     *
//     * @return a <code>long</code> value
//     */
//    public long framesToMSF() {
//    }
//    
//    /**
//     * Describe <code>msfToFrames</code> method here.
//     *
//     * @return a <code>long</code> value
//     */
//    public long msfToFrames() {
//    }

        /**
     * Return a string represenation of this object
     *
     * @return a String represenation of this object
     */
    public String toString() {
	StringBuffer buf = new StringBuffer();

	buf.append("SDLCDtrack[").
	    append("id=").append(getId()).
	    append(", type=").append(getType()).
	    append(", length=").append(getLength()).
	    append(", offset=").append(getOffset()).
	    append("]");
	
	return buf.toString();
    }
}