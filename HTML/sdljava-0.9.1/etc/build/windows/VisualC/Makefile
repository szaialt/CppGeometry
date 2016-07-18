# Makefile for using SWIG and Java for C code

SDLJAVA_I = SDLAudio.i SDLCdrom.i SDLEvent.i SDLGFX.i SDLImage.i SDLJoystick.i SDLMain.i SDLMixer.i SDLTTF.i SDLVideo.i

SDLJAVA_SRCS          = SDLAudio_wrap.c SDLEvent_wrap.c SDLMain_wrap.c SDLVideo_wrap.c SDLJoystick_wrap.c SDLCdrom_wrap.c
SDLJAVA_OBJ           = SDLAudio_wrap.obj SDLEvent_wrap.obj SDLMain_wrap.obj SDLVideo_wrap.obj SDLJoystick_wrap.obj SDLCdrom_wrap.obj
SDLJAVA_LIB           = SDL.lib

SDLJAVA_IMAGE_SRCS   = SDLImage_wrap.c
SDLJAVA_IMAGE_OBJ    = SDLImage_wrap.obj
SDLJAVA_IMAGE_LIB    = SDL.lib SDL_image.lib

SDLJAVA_MIXER_SRCS   = SDLMixer_wrap.c
SDLJAVA_MIXER_OBJ    = SDLMixer_wrap.obj
SDLJAVA_MIXER_LIB    = SDL.lib SDL_mixer.lib

SDLJAVA_TTF_SRCS   = SDLTTF_wrap.c
SDLJAVA_TTF_OBJ    = SDLTTF_wrap.obj
SDLJAVA_TTF_LIB    = SDL.lib SDL_ttf.lib

SDLJAVA_GFX_SRCS   = SDLGFX_wrap.c
SDLJAVA_GFX_OBJ    = SDLGFX_wrap.obj SDLVideo_wrap.obj
SDLJAVA_GFX_LIB    = SDL.lib SDL_gfx.lib

# Location of the Visual C++ tools (32 bit assumed)
SWIG          = C:\SWIG\swig.exe
TOOLS         = C:\PROGRA~1\MIAF9D~1\VC98
TARGET        = sdljava.dll
CC            = $(TOOLS)\bin\cl.exe
LINK          = $(TOOLS)\bin\link.exe
INCLUDE32     = -I$(TOOLS)\include
MACHINE       = IX86

# C Library needed to build a DLL
DLLIBC        = msvcrt.lib oldnames.lib  

# Windows libraries that are apparently needed
WINLIB        = kernel32.lib advapi32.lib user32.lib gdi32.lib comdlg32.lib winspool.lib

# Libraries common to all DLLs
LIBS          = $(DLLIBC) $(WINLIB) 

# Linker options
LOPT      = -debug:full -debugtype:cv /NODEFAULTLIB /RELEASE /NOLOGO \
             /MACHINE:$(MACHINE) -entry:_DllMainCRTStartup@12 -dll

# C compiler flags

CFLAGS        = /Z7 /Od /c /nologo
JAVA_INCLUDE  = -Ic:\jdk1.5.0\include -Ic:\jdk1.5.0\include\win32

all::sdljava sdljava_image sdljava_ttf sdljava_gfx sdljava_mixer

#
#
# NOTE:  if you want to work on the sdljava native layer please un-comment the following lines
#
#SDLAudio_wrap.c:: SDLAudio.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLAudio.i
#
#SDLCdrom_wrap.c:: SDLCdrom.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLCdrom.i
#
#SDLEvent_wrap.c:: SDLEvent.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLEvent.i
#
#SDLGFX_wrap.c:: SDLGFX.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLGFX.i
#
#SDLImage_wrap.c:: SDLImage.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLImage.i
#
#SDLJoystick_wrap.c:: SDLJoystick.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLJoystick.i
#
#SDLMain_wrap.c:: SDLMain.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLMain.i
#
#SDLMixer_wrap.c:: SDLMixer.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLMixer.i
#
#SDLTTF_wrap.c:: SDLTTF.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLTTF.i
#
#SDLVideo_wrap.c:: SDLVideo.i common.i
#	$(SWIG) -importall -java -package sdljava.x.swig -outdir ../x/swig SDLVideo.i

sdljava::
	$(CC) $(CFLAGS) $(JAVA_INCLUDE) $(SDLJAVA_SRCS)
	set LIB=$(TOOLS)\lib
        $(LINK) $(LOPT) -out:sdljava.dll $(LIBS) $(SDLJAVA_LIB) $(SDLJAVA_OBJ)
        copy sdljava.dll ..\..\..\lib
        del /F *.exp *.pdb *.lib

sdljava_image::
	$(CC) $(CFLAGS) $(JAVA_INCLUDE) $(SDLJAVA_IMAGE_SRCS)
	set LIB=$(TOOLS)\lib
	$(LINK) $(LOPT) -out:sdljava_image.dll $(LIBS) $(SDLJAVA_IMAGE_LIB) $(SDLJAVA_IMAGE_OBJ)
        copy sdljava_image.dll ..\..\..\lib
        del /F *.exp *.pdb *.lib

sdljava_mixer::
	$(CC) $(CFLAGS) $(JAVA_INCLUDE) $(SDLJAVA_MIXER_SRCS)
	set LIB=$(TOOLS)\lib
	$(LINK) $(LOPT) -out:sdljava_mixer.dll $(LIBS) $(SDLJAVA_MIXER_LIB) $(SDLJAVA_MIXER_OBJ)
        copy sdljava_mixer.dll ..\..\..\lib
        del /F *.exp *.pdb *.lib

sdljava_ttf::
	$(CC) $(CFLAGS) $(JAVA_INCLUDE) $(SDLJAVA_TTF_SRCS)
	set LIB=$(TOOLS)\lib
	$(LINK) $(LOPT) -out:sdljava_ttf.dll $(LIBS) $(SDLJAVA_TTF_LIB) $(SDLJAVA_TTF_OBJ)
        copy sdljava_ttf.dll ..\..\..\lib
        del /F *.exp *.pdb *.lib

sdljava_gfx::
	$(CC) $(CFLAGS) $(JAVA_INCLUDE) $(SDLJAVA_GFX_SRCS)
	set LIB=$(TOOLS)\lib
	$(LINK) $(LOPT) -out:sdljava_gfx.dll $(LIBS) $(SDLJAVA_GFX_LIB) $(SDLJAVA_GFX_OBJ)
        copy sdljava_gfx.dll ..\..\..\lib
        del /F *.exp *.pdb *.lib

clean::
	del /F *.dll *.lib *.pch

