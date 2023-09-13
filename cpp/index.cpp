#include <iostream>
#include <emscripten/emscripten.h>
using namespace std;

extern "C"
{
  EMSCRIPTEN_KEEPALIVE
  float add(float a, float b) {
    return a + b;
  }

  EMSCRIPTEN_KEEPALIVE
  float multiply(float a, float b) {
    return a * b;
  }

  EMSCRIPTEN_KEEPALIVE
  float devide(float a, float b) {
    return a / b;
  }

  EMSCRIPTEN_KEEPALIVE
  float substract(float a, float b) {
    return a - b;
  }
}

int main() {
  return 0;
}