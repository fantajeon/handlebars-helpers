/**
 * This file provides the mock "data" received
 * by your visualization code when you develop
 * locally.
 *
 */
export const message = {
  tables: {
    DEFAULT: [
      {
          "dimension1": [
              "School",
              "Havard",
              JSON.stringify({
                "Age": "20",
                "Gender": "Male"
              })
          ]
      },
      {
          "dimension1": [
              "Company", 
              "Google",
              JSON.stringify({"samples_per_second":null,"tokens_per_second":null,"exact_match":null,"f1":null,"rouge1":45.3237,"rouge2":23.1013,"rougeL":29.4723,"rougeLsum":42.9775,"gen_len":32660012,"gen_num":24576,"gen_tok_len":7124840})
          ]
      },
      {
          "dimension1": [
              "Family",
              "John",
              JSON.stringify({
                "Age": "20",
                "Gender": "Male"
              })
          ]
      },
    ],
  },
  fields: {
    dimension1: [
        {
          id: "qt_hjasifernd",
          name: "dim2",
          type: "TEXT",
          concept: "DIMENSION"
        },
        {
            id: "qt_hvdh6gernd",
            name: "dim1",
            type: "TEXT",
            concept: "DIMENSION"
        },
        {
          id: "qt_hvdh6gernd",
          name: "dim3",
          type: "TEXTAREA",
          concept: "DIMENSION"
        }
      ]
  },
  style: {
    bodyTemplate: {
      value: "TOP: {{topN}}<div id='container'>{{#each items}}<div>CardId: {{this.cardId}}</div>{{/each}}</div>",
    },
    cssTemplate: {
      value: `
        body { font-family: Arial, sans-serif; }
        .MuiButton-root {
          border-radius: 20px;
          text-transform: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        .MuiButton-root:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .MuiButton-contained {
          background: linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);
        }
      `,
    },
    topN: {
      value: 10,
      options: {
        enabled: {
          value: false
        }
      }
    },
    paged: {
      value: 2,
      options: {
        enabled: {
          value: true
        }
      }
    }
  },
};
