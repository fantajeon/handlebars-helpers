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
              JSON.stringify({
                "Age": "20",
                "Gender": "Male"
              })
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
      value: "<div class='card'>{{dim2}} ({{dim1}}) {{JsonTree dim3}}</div>",
    },
    scriptTemplate: {
      value: "console.log('Hello, World!');",
    },
  },
};
