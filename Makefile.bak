SRC_DIR = ./components/suave/less/
DES_DIR = ./components/suave/css/

build: clean
	@echo "compiling LESS files"
	@lessc $(SRC_DIR)suave.less $(DES_DIR)suave.css
	@echo "compiling HTMLs"
	@cd templates; nodefront compile -o ../

clean:
	@echo "cleaning compiled CSS"
	@rm -f $(DES_DIR)suave.css
	@echo "cleaning compiled HTMLs"
	@rm -f *.html

