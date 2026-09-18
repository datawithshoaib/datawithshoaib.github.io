# frozen_string_literal: true

module Jekyll
  class PostReader
    # Allow blog posts in _posts to be read without requiring a date prefix (YYYY-MM-DD-) in the filename.
    # - If the filename starts with a date prefix (e.g. 2024-10-19-title.md), Jekyll processes it as usual.
    # - If the filename does not have a date prefix (e.g. title.md), Jekyll reads it and relies on the 'date'
    #   field in the YAML front matter.
    def read_posts(dir)
      read_publishable(dir, "_posts", Document::DATELESS_FILENAME_MATCHER).tap do |docs|
        docs.each do |doc|
          doc.data["date"] ||= doc.date
        end
      end
    end
  end
end
