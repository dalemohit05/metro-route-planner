SRC_DIR = src
OUT_DIR = out
MAIN    = metro.Main

.PHONY: all run clean

all:
	@mkdir -p $(OUT_DIR)
	@find $(SRC_DIR) -name "*.java" | xargs javac -encoding UTF-8 -d $(OUT_DIR) -sourcepath $(SRC_DIR)
	@echo "Build successful."

run: all
	@java -cp $(OUT_DIR) $(MAIN)

clean:
	@rm -rf $(OUT_DIR)
	@echo "Cleaned."
