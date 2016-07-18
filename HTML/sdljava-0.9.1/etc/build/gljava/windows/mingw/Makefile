# build file for mingw on windows platform, assumed you are running from within MinGW Unix-like Env
CC = gcc

# assumed you have java mounted in /java 
# add a line like so in your /etc/fstab and restart the MinGW
# c:/<path to your java>	/java

INCLUDE=-I. -I$(JAVA_HOME)/include -I$(JAVA_HOME)/include/linux -I/usr/include -I/usr/local/include

GLJAVA_I=glew.i

GLJAVA_OBJ=glew_wrap.o
GLJAVA_LIB=-lGLEW

all:	gljava.dll


%.o: %.c
	$(CC) $(CFLAGS) $(INCLUDE) -c $< -o $@

libgljava.so: $(GLJAVA_OBJ)
	$(CC) -shared -o libgljava.so $(GLJAVA_OBJ) $(GLJAVA_LIB)
	cp libgljava.so ../../../../../lib

clean:
	rm *.o *.so
