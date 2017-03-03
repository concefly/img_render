
<div>
  <h3><%= noteData.title %></h3>
  <p><%= noteData.desc %></p>
  <% if (noteData.images) { %>
    <% noteData.images.forEach( function (img) { %>
      <div><img style="max-width: 100%" src="<%= img %>" alt="读书截图" ></div>
    <% }); %>
  <% } %>
  <% if (extraData) { %>
    <img width="100" src="<%= extraData.qr %>" alt="公众号二维码">
  <% } %>
</div>