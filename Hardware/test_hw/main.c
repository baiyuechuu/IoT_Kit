#include "main.h"


void main(){
	DIRECT_SET(YELLOW);
	SET_LED(10);
	delay(1000);
	while(1){
			if(M_A){
				SET(RED);
				COUNT_0 = 7;
				COUNT_1 = 5;
				DISPLAY(5);

				
				SET(GREEN);
				COUNT_0 = 5;
				COUNT_1 = 7;
				DISPLAY(5);
			}else{
				SET_LED(10);
				if(R_G)
					SET(RED);
				else
					SET(GREEN);
			}
	}
}