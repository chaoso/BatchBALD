export default function(dom, data) {
  let citations = data.citations;
  /*if (data.citations) {
    citations = Object.keys(data.citations).map(c => data.citations[c]);
    citations.sort((a, b) => {
      return a.author.localeCompare(b.author);
    });
  }*/

  var citeTags = [].slice.apply(dom.querySelectorAll("dt-cite"));
  console.log(citeTags);
  citeTags.forEach(el => {
    var keys = el.getAttribute("key").split(",");
    console.log(keys)
    var cite_string = inline_cite_short(keys);
    el.innerHTML = cite_string;
  });

  let bibEl = dom.querySelector("dt-bibliography");
  if (bibEl) {
    let ol = dom.createElement("ol");
    citations.forEach(key => {
      let el = dom.createElement("li");
      el.textContent = bibliography_cite(data.bibliography[key]);
      ol.appendChild(el);
    })
    bibEl.appendChild(ol);
  }

  function inline_cite_short(keys){
    function cite_string(key){
      if (key in data.bibliography){
        var n = data.citations.indexOf(key)+1;
        return ""+n;
      } else {
        return "?";
      }
    }
    return "["+keys.map(cite_string).join(", ")+"]";
  }

  function inline_cite_long(keys){
    function cite_string(key){
      if (key in data.bibliography){
        var ent = data.bibliography[key];
        var names = ent.author.split(" and ");
        names = names.map(name => name.split(",")[0].trim())
        var year = ent.year;
        if (names.length == 1) return names[0] + ", " + year;
        if (names.length == 2) return names[0] + " & " + names[1] + ", " + year;
        if (names.length  > 2) return names[0] + ", et al., " + year;
      } else {
        return "?";
      }
    }
    return keys.map(cite_string).join(", ");
  }

  function bibliography_cite(ent){
    if (ent){
      var names = ent.author.split(" and ");
      var cite = "";
      let name_strings = names.map(name => {
        var last = name.split(",")[0].trim();
        var firsts = name.split(",")[1];
        if (firsts != undefined) {
          var initials = firsts.trim().split(" ").map(s => s.trim()[0]);
          return last + ", " + initials.join(".")+".";
        }
        return last;
      });
      if (names.length > 1) {
        cite += name_strings.slice(0, names.length-1).join(", ");
        cite += " and " + name_strings[names.length-1];
      } else {
        cite += name_strings[0]
      }
      cite += ", " + ent.year + ". "
      cite += ent.title + ". "
      cite += (ent.journal || ent.booktitle || "")
      if ("volume" in ent){
        var issue = ent.issue || ent.number;
        issue = (issue != undefined)? "("+issue+")" : "";
        cite += ", Vol " + ent.volume + issue;
      }
      if ("pages" in ent){
        cite += ", pp. " + ent.pages
      }
      cite += ". "
      return cite
    } else {
      return "?";
    }
  }


  //https://scholar.google.com/scholar?q=allintitle%3ADocument+author%3Aolah
  function get_URL(ent){
    if (ent){
      var names = ent.author.split(" and ");
      names = names.map(name => name.split(",")[0].trim())
      var title = ent.title.split(" ")//.replace(/[,:]/, "")
      var url = "http://search.labs.crossref.org/dois?"//""https://scholar.google.com/scholar?"
      url += uris({q: names.join(" ") + " " + title.join(" ")})
    }

  }
}