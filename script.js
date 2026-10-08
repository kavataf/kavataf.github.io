console.log("Process JavaScript loaded!");
$(function() {

    $('.navbar-toggle').click(function() {
        $(this).toggleClass('act');
            if($(this).hasClass('act')) {
                $('.main-menu').addClass('act');
            }
            else {
                $('.main-menu').removeClass('act');
            }
    });

    //jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.site-header',
        offset: 10
    });

	/* Progress bar */
    var $section = $('.section-skills');
    function loadDaBars() {
	    $('.progress .progress-bar').progressbar({
	        transition_delay: 500
	    });
    }
    
    $(document).bind('scroll', function(ev) {
        var scrollOffset = $(document).scrollTop();
        var containerOffset = $section.offset().top - window.innerHeight;
        if (scrollOffset > containerOffset) {
            loadDaBars();
            // unbind event not to load scrolsl again
            $(document).unbind('scroll');
        }
    });

    /* Counters  */
    if ($(".section-counters .start").length>0) {
        $(".section-counters .start").each(function() {
            var stat_item = $(this),
            offset = stat_item.offset().top;
            $(window).scroll(function() {
                if($(window).scrollTop() > (offset - 1000) && !(stat_item.hasClass('counting'))) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
            });
        });
    };

	// another custom callback for counting to infinity
	$('#infinity').data('countToOptions', {
		onComplete: function (value) {
		  count.call(this, {
		    from: value,
		    to: value + 1
		  });
		}
	});

	$('#infinity').each(count);

	function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }

    // Navigation overlay
    var s = skrollr.init({
            forceHeight: false,
            smoothScrolling: false,
            mobileDeceleration: 0.004,
            mobileCheck: function() {
                //hack - forces mobile version to be off
                return false;
            }
    });
    
});
// const form = document.querySelector("#form");
// const Name = document.querySelector(".name");
// const email = document.querySelector(".email");
// const message = document.querySelector(".message");

// const messagebody = `name: ${Name.value} <br> email: ${email.value} <br> message: ${message.value}`;

// function emailsend(){

//     Email.send({
//         Host : "smtp.elasticemail.com",
//         Username : "kavatafaith412@gmail.com",
//         Password : "C6361C3D4FAEB9D960AF8D053311DB2B94C4",
//         To : 'kavatafaith412@gmail.com',
//         From : "kavatafaith412@gmail.com", 
//         Body : messagebody
//     }).then(
//       message => alert(message = "Message not sent successfully!")
      
//     );
// }

// form.addEventListener("submit", function(e){
//     e.preventDefault();
//     emailsend();
// });


// process stack 

const processSteps = [
    {
        number: "01",
        title: "Problem",
        description:
            "I start by understanding the problem, the users, their needs and the goals of the project before writing any code.",
        tag: "Understand requirements"
    },

    {
        number: "02",
        title: "Research & Design",
        description:
            "I research the requirements and create a clear structure for the solution. I use wireframes and user flows to plan the experience.",
        tag: "Plan the user experience"
    },

    {
        number: "03",
        title: "Data",
        description:
            "I identify the data, APIs and information required by the system and determine how they should be structured and managed.",
        tag: "Structure data & integrations"
    },

    {
        number: "04",
        title: "Analysis",
        description:
            "I break the requirements into smaller technical tasks, evaluate possible approaches and select the technologies that best fit the project.",
        tag: "Define the technical approach"
    },

    {
        number: "05",
        title: "Build",
        description:
            "I develop the solution using clean, maintainable code, integrate APIs and databases, and continuously test and refine the application.",
        tag: "Develop & test"
    },

    {
        number: "06",
        title: "Solution",
        description:
            "I validate the completed solution against the original requirements and make improvements until the application delivers the intended result.",
        tag: "Deliver a working solution"
    }
];

let currentStep = 0;

const layers = document.querySelectorAll(".process-layer");
const stepNumber = document.getElementById("stepNumber");
const stepLabel = document.getElementById("stepLabel");
const stepTitle = document.getElementById("stepTitle");
const stepDescription = document.getElementById("stepDescription");
const stepTag = document.getElementById("stepTag");
const progress = document.querySelectorAll(".process-progress span");
const nextButton = document.getElementById("nextStep");
const prevButton = document.getElementById("prevStep");


function updateProcess(step) {
    currentStep = step;
    const data = processSteps[step];
    stepNumber.textContent = data.number;
    stepLabel.textContent =
        `LAYER ${step + 1} OF ${processSteps.length}`;
    stepTitle.textContent = data.title;
    stepDescription.textContent =
        data.description;
    stepTag.textContent =
        data.tag;

    /* Active layer */

    layers.forEach((layer, index) => {
        layer.classList.toggle(
            "active",
            index === step
        );
    });

    /* Progress */

    progress.forEach((bar, index) => {
        bar.classList.toggle(
            "active",
            index <= step
        );
    });

    /* Disable buttons */

    prevButton.disabled = step === 0;
    nextButton.disabled =
        step === processSteps.length - 1;
}

/* CLICK LAYER */

layers.forEach((layer) => {
    layer.addEventListener("click", () => {

        const step =
            parseInt(layer.dataset.step);

        updateProcess(step);
    });
});

/* NEXT */

nextButton.addEventListener("click", () => {
    if (currentStep < processSteps.length - 1) {
        updateProcess(currentStep + 1);
    }
});

/* BACK */

prevButton.addEventListener("click", () => {
    if (currentStep > 0) {
        updateProcess(currentStep - 1);
    }
});

/* INITIAL STATE */

updateProcess(0);
