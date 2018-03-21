var React = require('react');
var Griddle = require('griddle-react');
var GriddleWithCallback = require('./GriddleWithCallback');
var StructuredFilter = require('../../src/main');

require('../../src/react-structured-filter.css');

var ExampleData = require('./ExampleData');

var ExampleTable = React.createClass({
  getInitialState: function() {
    return {
      filter: [
            {
              category: 'Industry',
              operator: '==',
              value: 'Music',
            },
            {
              category: 'IPO',
              operator: '>',
              value: 'Dec 8, 1980 10:50 PM',
            },
          ],
      header: {
        first: "Category1",
        second: "Operator1",
        third: "Value1"
      },
    }
  },


  getJsonData: function(filterString, sortColumn, sortAscending, page, pageSize, callback) {

    if (filterString==undefined) {
      filterString = "";
    }
    if (sortColumn==undefined) {
      sortColumn = "";
    }

    // Normally you would make a Reqwest here to the server
    var results = ExampleData.filter(filterString, sortColumn, sortAscending, page, pageSize);
    callback(results);
  },


  updateFilter: function(filter){
    // Set our filter to json data of the current filter tokens
    this.setState({filter: filter});
  },


  getSymbolOptions: function() {
    return ExampleData.getSymbolOptions();
  },

  getSectorOptions: function() {
    return ExampleData.getSectorOptions();
  },

  getIndustryOptions: function() {
    return ExampleData.getIndustryOptions();
  },


  render: function(){
    return (
      <div>
        <StructuredFilter
          placeholder="Filter data..."
          options={[
            {category:"Symbol", type:"textoptions", options:this.getSymbolOptions},
            {category:"Name",type:"text"},
            {category:"Price",type:"number"},
            {category:"MarketCap",type:"number"},
            {category:"IPO", type:"date"},
            {category:"Sector", type:"textoptions", options:this.getSectorOptions},
            {category:"Industry", type:"textoptions", options:this.getIndustryOptions}
            ]}
          customClasses={{
            input: "filter-tokenizer-text-input",
            results: "filter-tokenizer-list__container",
            listItem: "filter-tokenizer-list__item"
          }}
          onChange={this.updateFilter}
          value={this.state.filter}
          header={this.state.header}
        />
        <GriddleWithCallback
          getExternalResults={this.getJsonData} filter={JSON.stringify(this.state.filter)}
          resultsPerPage={10}
        />
      </div>
    )
  }
});
module.exports = ExampleTable;
