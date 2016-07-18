package sdljava.video;
/**
 *  sdljava - a java binding to the SDL API
 *
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
/**
 * Describe class <code>SDLRect</code> here.
 *
 * @author  Ivan Z. Ganza
 * @version $Id: SDLRect.java,v 1.3 2005/01/19 03:09:14 ivan_ganza Exp $
 */
public class SDLRect {

    public int x, y, width, height;

    public SDLRect() {
    }

    public SDLRect(int x, int y) {
	this.x = x;
	this.y = y;
    }

    public SDLRect(int x, int y, int width, int height) {
	this(x,y);
	this.width = width;
	this.height = height;
    }

    /**
     * Gets the value of x
     *
     * @return the value of x
     */
    public int getX()  {
	return this.x;
    }

    /**
     * Sets the value of x
     *
     * @param argX Value to assign to this.x
     */
    public void setX(int argX) {
	this.x = argX;
    }

    /**
     * Gets the value of y
     *
     * @return the value of y
     */
    public int getY()  {
	return this.y;
    }

    /**
     * Sets the value of y
     *
     * @param argY Value to assign to this.y
     */
    public void setY(int argY) {
	this.y = argY;
    }

    /**
     * Gets the value of width
     *
     * @return the value of width
     */
    public int getWidth()  {
	return this.width;
    }

    /**
     * Sets the value of width
     *
     * @param argWidth Value to assign to this.width
     */
    public void setWidth(int argWidth) {
	this.width = argWidth;
    }

    /**
     * Gets the value of height
     *
     * @return the value of height
     */
    public int getHeight()  {
	return this.height;
    }

    /**
     * Sets the value of height
     *
     * @param argHeight Value to assign to this.height
     */
    public void setHeight(int argHeight) {
	this.height = argHeight;
    }

    public void setLocation(int x, int y) {
	this.x = x;
	this.y = y;
    }

    public void setSize(int width, int height) {
	this.width = width;
	this.height = height;
    }

    /**
     * Return a string represenation of this object
     *
     * @return a String represenation of this object
     */
    public String toString() {
	StringBuffer buf = new StringBuffer();

	buf.append("SDLRect[").
	    append("x=").append(getX()).
	    append(", y=").append(getY()).
	    append(", width=").append(getWidth()).
	    append(", height=").append(getHeight()).
	    append("]");
	
	return buf.toString();
    }
}