library('tcltk')
library('sqldf')

graffitiData <- read.csv('~/Desktop/Graffiti_Locations.csv', stringsAsFactors = FALSE)

names(graffitiData)

names(graffitiData) <- c("Address", "Borough", "CBoard", "Pct", "CCDistrict", "CreatedMonth", "CreatedDay", "CreatedYear", "Status", "Resolution", "X", "Y", "ClosedMonth", "ClosedDay", "ClosedYear")

graffitiData$createdYearMonth <- paste(graffitiData$CreatedMonth, graffitiData$CreatedYear, sep = "_")
graffitiData$closedYearMonth <- paste(graffitiData$ClosedMonth, graffitiData$ClosedYear, sep = "_")



######################################
#   Tags by created date by Borough  #
######################################

graffitiCreatedMonthBoro <- sqldf('SELECT Borough, createdYearMonth as Date, count(*) as CreatedIncidents FROM  graffitiData GROUP BY Borough, createdYearMonth')

graffitiCreatedMonthBoro <- graffitiCreatedMonthBoro[with(graffitiCreatedMonthBoro, order(CreatedMonth)), ]


######################################
#   Tags by closed date by Borough  #
######################################


graffitiClosedMonthBoro <- sqldf('SELECT Borough, closedYearMonth as Date, count(*) as ClosedIncidents FROM  graffitiData GROUP BY Borough, closedYearMonth')

graffitiClosedMonthBoro <- graffitiClosedMonthBoro[with(graffitiClosedMonthBoro, order(ClosedMonth)), ]


#############################################
#   Split the boroughs into separate files  #
#############################################

library('plyr')

# MANHATTAN
gr_ManCreated <- sqldf('SELECT * from graffitiCreatedMonthBoro WHERE Borough = "MANHATTAN"  ')
gr_ManClosed <- sqldf('SELECT * from graffitiClosedMonthBoro WHERE Borough = "MANHATTAN"  ')

gr_Manhattan <- join (gr_ManCreated, gr_ManClosed, by = "Date", type = "inner")

# BROOKLYN
gr_BkCreated <- sqldf('SELECT * from graffitiCreatedMonthBoro WHERE Borough = "BROOKLYN"  ')
gr_BkClosed <- sqldf('SELECT * from graffitiClosedMonthBoro WHERE Borough = "BROOKLYN"  ')

gr_Brooklyn <- join (gr_BkCreated, gr_BkClosed, by = "Date", type = "inner")

# QUEENS
gr_QnCreated <- sqldf('SELECT * from graffitiCreatedMonthBoro WHERE Borough = "QUEENS"  ')
gr_QnClosed <- sqldf('SELECT * from graffitiClosedMonthBoro WHERE Borough = "QUEENS"  ')

gr_Queens <- join (gr_QnCreated, gr_QnClosed, by = "Date", type = "inner")

# STATEN ISLAND
gr_SiCreated <- sqldf('SELECT * from graffitiCreatedMonthBoro WHERE Borough = "STATEN ISLAND"  ')
gr_SiClosed <- sqldf('SELECT * from graffitiClosedMonthBoro WHERE Borough = "STATEN ISLAND"  ')

gr_StatenIsland <- join (gr_SiCreated, gr_SiClosed, by = "Date", type = "left")  

# BRONX
gr_BxCreated <- sqldf('SELECT * from graffitiCreatedMonthBoro WHERE Borough = "BRONX"  ')
gr_BxClosed <- sqldf('SELECT * from graffitiClosedMonthBoro WHERE Borough = "BRONX"  ')

gr_Bronx <- join (gr_BxCreated, gr_BxClosed, by = "Date", type = "inner")

##################################
# Make the files
###################################

write.csv(gr_Manhattan, "gr_Manhattan.csv", row.names=FALSE)
write.csv(gr_Brooklyn, "gr_Brooklyn.csv", row.names=FALSE)
write.csv(gr_Queens, "gr_Queens.csv", row.names=FALSE)
write.csv(gr_StatenIsland, "gr_StatenIsland.csv", row.names=FALSE)
write.csv(gr_Bronx, "gr_Bronx.csv", row.names=FALSE)
