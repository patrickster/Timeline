
## Load files
b <- read.csv("./Data/births.csv", as.is=TRUE)
d <- read.csv("./Data/deaths.csv", as.is=TRUE)

b <- b[,2:3]
d <- d[,2:3]

## Convert to numeric
b$Birth <- as.numeric(b$Birth)
d$Death <- as.numeric(d$Death)

## Remove outright duplicates
b.dups <- which(duplicated(b[,c("Label", "Birth")]))
b <- b[-b.dups,]
d.dups <- which(duplicated(d[,c("Label", "Death")]))
d <- d[-d.dups,]

## In cases where there are multiple dates associated with the same entity,
## use the earliest date (on inspection, usually seems to be correct)
dup.label.indices <- which(duplicated(b[,"Label"]) | duplicated(b[,"Label"],
                                                                fromLast=TRUE))
b.dup <- b[dup.label.indices,]
b <- b[-dup.label.indices,]
b.dup.agg <- aggregate(Birth ~ Label, b.dup, min)
b <- rbind(b, b.dup.agg)

dup.label.indices <- which(duplicated(d[,"Label"]) | duplicated(d[,"Label"],
                                                                fromLast=TRUE))
d.dup <- d[dup.label.indices,]
d <- d[-dup.label.indices,]
d.dup.agg <- aggregate(Death ~ Label, d.dup, min)
d <- rbind(d, d.dup.agg)

## Merge birth and death dates
lives <- merge(b, d, by="Label", all.x=TRUE)

## Remove pre-1900 entities where date of death is missing 
lives <- lives[-which(is.na(lives$death) & lives$Birth < 1900),]

nrow(lives)

## Write to csv
write.csv("../Data/lifespans.csv")

