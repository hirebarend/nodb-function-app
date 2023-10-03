param name string = 'nodb'

param location string = resourceGroup().location

resource operationalInsightsWorkspace 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: 'law-${name}-prod'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource insightsComponent 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-${name}-prod'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: operationalInsightsWorkspace.id
    Flow_Type: 'Bluefield'
  }
}

resource storageStorageAccount 'Microsoft.Storage/storageAccounts@2022-05-01' = {
  name: 'st${name}prod001'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {}
}

resource webServerfarm 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: 'asp-${name}-prod'
  location: location
  kind: 'linux'
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {}
}

resource webSite 'Microsoft.Web/sites@2021-03-01' = {
  name: 'app-${name}-prod-001'
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: webServerfarm.id
    siteConfig: {
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: insightsComponent.properties.ConnectionString
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${'st${name}prod001'};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageStorageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${'st${name}prod001'};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageStorageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower('app-${name}-prod-001')
        }
      ]
    }
  }
}
