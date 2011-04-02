#! /bin/bash

CARD_DIR="cards"

for i in {1..1000000}; do
	i=`printf %08d $i`
	
	d1=${i:0:2}
	d2=${i:2:2}
	d3=${i:4:2}
	
	new_dir="$CARD_DIR/$d1/$d2/$d3"
	
	mkdir -p $new_dir

	echo $i

	for pagename in Details Printings Languages Discussion; do
		filename="${i}_${pagename}.html"
		mv $CARD_DIR/$filename $new_dir/
	done

	#echo mv $CARD_DIR/$i\* $new_dir/
done
