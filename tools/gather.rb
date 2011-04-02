require 'rubygems'
require 'parallel'

endpoints = %w( Details Printings Languages )

Parallel.map((1..1000000).to_a, :in_threads => 40) do |multiverse_id|
#1.upto 1000000 do |multiverse_id|
	$stdout.print "#{multiverse_id} "

	endpoints.each do |endpoint|
		url = "http://gatherer.wizards.com/Pages/Card/#{ endpoint }.aspx?printed=false&multiverseid=#{ multiverse_id }"
		
		output_filename = "cards/#{'%08d' % multiverse_id.to_i}_#{endpoint.downcase}.html"


		# first, let's make sure it's a valid card:
		return_code = `curl -s -I "#{url}" | awk '{ print $2 }' | head -1`
		
		unless return_code.to_i == 200
			puts "NO CARD."
			break
		end

		$stdout.print "."

		`curl -s -o #{output_filename} "#{url}"`

	end

	puts ""
end
