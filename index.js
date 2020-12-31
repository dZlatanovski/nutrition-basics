$(function() {
    let sidenav = $('.sidenav').sidenav();

    $('nav a, .sidenav a, .scroll-link').on('click', function(e) {
        e.preventDefault();
        sidenav.sidenav('close');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("." + $(this).attr('href')).offset().top
        }, 1000);
    });

    $('.ingredient_preview').on('click', function(e) {
        e.preventDefault();
    });

    $('.ingredient_preview').on("mouseenter", function(e) {
        let imgSrc = $(this).attr('href');
        let previewImg = $('.ingredient_preview_img');
        previewImg.attr('src', imgSrc);
        let mousePos = {
            x: e.pageX,
            y: e.pageY - 225
        };
        previewImg.css('left', mousePos.x);
        previewImg.css('top', mousePos.y);
        previewImg.toggleClass('hide');
    });

    $('.ingredient_preview').on("mouseleave", function(e) {
        let previewImg = $('.ingredient_preview_img');
        previewImg.toggleClass('hide');
    });

    let ingredients = $.ajax({
        method: "GET",
        url: "./ingredients.json",
        dataType: "json",
        success: function(data) {
            initIngredients(data);
            let ingredients = $('.ingredient-item');
            $('#ingredient-search').on('keyup', function(e) {
                filterIngredients(ingredients, $(this).val());
            });
        },
        error: function(err) {
            console.log(err);
        }
    });

    function initIngredients(ingredientsJson) {
        let counter = 0;
        for (const ingredientName in ingredientsJson) {
            if (counter > 7) {
                return;
            }
            counter++;
            if (Object.hasOwnProperty.call(ingredientsJson, ingredientName)) {
                const element = ingredientsJson[ingredientName];
                let item = $('<div class="center-align ingredient-item orange lighten-3"></div>');
                $('<h4 class="ingredient-item-title">' + ingredientName + '</h4>').appendTo(item);
                let itemMacros = $('<ul class="ingredient-item-macros">');
                for (const key in element) {
                    if (Object.hasOwnProperty.call(element, key)) {
                        $('<li>' + key + ": " + element[key] + "</li>").appendTo(itemMacros);
                    }
                }
                item.append(itemMacros);
                item.appendTo($('.ingredients-list'));
            }
        }
    }

    function filterIngredients(ingredients, searchString) {
        let iframe = $('.ingredients-iframe');
        iframe.removeClass('active');

        if (searchString == "") {
            ingredients.removeClass('hidden');
            return;
        }

        let foundIngredient = false;
        $.each(ingredients, function(index, ingredient) {
            ingredient = $(ingredient);
            if (ingredient.find('h4').text().toLowerCase().includes(searchString.toLowerCase())) {
                ingredient.removeClass('hidden');
                foundIngredient = true;
            } else {
                if (!ingredient.hasClass('hidden')) {
                    ingredient.addClass('hidden');
                }
            }
        });
        
        setTimeout(function() {
            if (!foundIngredient) {
                if (!iframe.hasClass('active')) {
                    iframe.addClass('active');
                }
                iframe.attr('src', 'https://www.google.com/search?igu=1&ei=&q=' + searchString + " nutrition");
            }
        }, 250);
    }
    
});