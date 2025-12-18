# pip install reportlab
from reportlab.lib.pagesizes import A4, letter, A3
from reportlab.pdfgen import canvas

c = canvas.Canvas("test_multi_size.pdf")

# Page 1 - A4 Portrait
c.setPageSize(A4)
c.drawString(100, 400, "Page 1 - A4 Portrait")
c.showPage()

# Page 2 - A4 Landscape
c.setPageSize((A4[1], A4[0]))
c.drawString(100, 400, "Page 2 - A4 Landscape")
c.showPage()

# Page 3 - Letter
c.setPageSize(letter)
c.drawString(100, 400, "Page 3 - Letter")
c.showPage()

# Page 4 - A3
c.setPageSize(A3)
c.drawString(100, 400, "Page 4 - A3")
c.showPage()

# Page 5 - A4 Portrait again
c.setPageSize(A4)
c.drawString(100, 400, "Page 5 - A4 Portrait")
c.showPage()

c.save()
print("PDF created successfully at test_multi_size.pdf")
