package sdljava.event;
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
/**
 * This event is unique, it is never created by SDL but only by the
 * user. The event can be pushed onto the event queue using
 * SDL_PushEvent. The contents of the structure members or completely
 * up to the programmer, the only requirement is that type is a value
 * from SDL_USEREVENT to SDL_NUMEVENTS-1 (inclusive).
 *
 * @author Ivan Z. Ganza
 * @version $Id: SDLUserEvent.java,v 1.4 2005/01/25 02:50:45 ivan_ganza Exp $
 */
public class SDLUserEvent extends SDLEvent {
    /**
     * The type of the this event
     *
     * @return The type of event
     */
    public int getType() {
	return -1;
    }
}
