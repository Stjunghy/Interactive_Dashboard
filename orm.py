def getSampleNames():
    db_uri = 'sqlite:///DataSets/belly_button_biodiversity.sqlite'

    from sqlalchemy import create_engine
    engine = create_engine(db_uri,echo=False)
    from sqlalchemy.ext.automap import automap_base
    Base = automap_base()

    # reflect the database tables
    Base.prepare(engine, reflect=True)

    Otu = Base.classes.otu
    Samples = Base.classes.samples
    Samples_metadata = Base.classes.samples_metadata

    # Create session
    from sqlalchemy.orm import Session
    session = Session(engine)

    
    sampleNames = []
    for sampleid in session.query(Samples_metadata.SAMPLEID).all():
        sampleNames.append("BB_"+str(sampleid[0]))

    # return sample names
    return sampleNames


def getOTUbySamples(sample_id):
    db_uri = 'sqlite:///DataSets/belly_button_biodiversity.sqlite'

    
    from sqlalchemy import create_engine
    engine = create_engine(db_uri,echo=False)

    
    from sqlalchemy.ext.automap import automap_base
    Base = automap_base()

    Base.prepare(engine, reflect=True)

    Otu = Base.classes.otu
    Samples = Base.classes.samples
    Samples_metadata = Base.classes.samples_metadata

    from sqlalchemy.orm import Session
    session = Session(engine)

    otuIDbySample = []

    for row in session.query(Samples).all():
        otuIDbySample.append(row.__dict__)

    import pandas as pd
    otuIDbySample = pd.DataFrame.from_dict(otuIDbySample, orient='columns', dtype=None)

    otuIDbySample = otuIDbySample[sample_id].sort_values(ascending=False)[:10].reset_index()
    otuIDbySample.columns =["otu_ids","sample_values"]

    return otuIDbySample.to_json(orient='columns')


def getSampleMetaData(sample_id):
    db_uri = 'sqlite:///DataSets/belly_button_biodiversity.sqlite'

    from sqlalchemy import create_engine
    engine = create_engine(db_uri,echo=False)

    from sqlalchemy.ext.automap import automap_base
    Base = automap_base()

    Base.prepare(engine, reflect=True)

    Otu = Base.classes.otu
    Samples = Base.classes.samples
    Samples_metadata = Base.classes.samples_metadata

    from sqlalchemy.orm import Session
    session = Session(engine)

    sampleMetaData = []

    for row in session.query(Samples_metadata).all():
        sampleMetaData.append(row.__dict__)

    import pandas as pd
    sampleMetaData = pd.DataFrame.from_dict(sampleMetaData, orient='columns', dtype=None)

    sample_id = pd.to_numeric(sample_id[3:])

    print(sample_id)
    meta  = sampleMetaData[sampleMetaData['SAMPLEID']==sample_id]
    meta = meta[['AGE','BBTYPE','ETHNICITY','GENDER','LOCATION','SAMPLEID']]

    meta = [{u: str(v)} for (u, v) in meta.iloc[0].iteritems()]
    return meta

def getWashingFreq(sample_id):
 
    db_uri = 'sqlite:///DataSets/belly_button_biodiversity.sqlite'

    from sqlalchemy import create_engine
    engine = create_engine(db_uri,echo=False)

    from sqlalchemy.ext.automap import automap_base
    Base = automap_base()

    Base.prepare(engine, reflect=True)

    Otu = Base.classes.otu
    Samples = Base.classes.samples
    Samples_metadata = Base.classes.samples_metadata

    from sqlalchemy.orm import Session
    session = Session(engine)

    washingFreq = []

    for row in session.query(Samples_metadata).all():
        washingFreq.append(row.__dict__)

    import pandas as pd
    washingFreqDf = pd.DataFrame.from_dict(washingFreq, orient = "columns")

    sample_id = pd.to_numeric(sample_id[3:])

    wFreq = washingFreqDf[washingFreqDf['SAMPLEID']==sample_id]['WFREQ']

    wFreq = float(wFreq.iloc[0])

    return wFreq